// =============================================================================
// KWENTO - Chat API Route
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  systemPrompt: string
}

// Determine which AI provider to use
const AI_PROVIDER = process.env.AI_PROVIDER || 'anthropic'
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, systemPrompt } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    let content: string

    if (AI_PROVIDER === 'gemini' && GEMINI_API_KEY) {
      content = await callGemini(messages, systemPrompt)
    } else if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
      content = await callAnthropic(messages, systemPrompt)
    } else if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) {
      content = await callOpenAI(messages, systemPrompt)
    } else {
      // Fallback: echo mode for development without API keys
      content = getFallbackResponse(messages)
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Anthropic Claude API
async function callAnthropic(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${error}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// OpenAI API
async function callOpenAI(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Google Gemini API
async function callGemini(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  // Convert messages to Gemini format
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        generationConfig: {
          maxOutputTokens: 1024,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${error}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}

// Fallback responses for development without API keys
function getFallbackResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1].content.toLowerCase()
  const userContent = messages[messages.length - 1].content

  // Extract potential names (capitalized words) for demo element creation
  const nameMatch = userContent.match(/\b[A-Z][a-z]+\b/)
  const name = nameMatch ? nameMatch[0] : 'The Protagonist'

  if (messages.length === 1) {
    return `Interesting! I'm picking up some ideas here. Let me organize what I'm seeing:

I'm detecting [CHARACTER: ${name} | A central figure in your story] and what sounds like [IDEA: Story Concept | ${userContent.slice(0, 40)}...].

Tell me more - what's the central conflict or tension? What does ${name} want?

*(Demo mode - add ANTHROPIC_API_KEY to .env.local for full AI)*`
  }

  if (lastMessage.includes('character') || lastMessage.includes('person') || lastMessage.includes('hero')) {
    return `Great character work! I'm adding [CHARACTER: ${name} | Based on your description].

What drives them? What do they want more than anything, and what's standing in their way?`
  }

  if (lastMessage.includes('scene') || lastMessage.includes('moment') || lastMessage.includes('when')) {
    return `I can see this scene forming. Adding [SCENE: Key Moment | ${userContent.slice(0, 30)}...].

What emotional tone does this moment carry? What changes because of it?`
  }

  if (lastMessage.includes('place') || lastMessage.includes('setting') || lastMessage.includes('world')) {
    return `Interesting setting! Marking [LOCATION: Story World | ${userContent.slice(0, 30)}...].

What rules govern this place? What makes it unique?`
  }

  if (lastMessage.includes('conflict') || lastMessage.includes('problem') || lastMessage.includes('struggle')) {
    return `That's compelling tension. Adding [CONFLICT: Central Struggle | ${userContent.slice(0, 30)}...].

How does this escalate? What's at stake if things go wrong?`
  }

  if (lastMessage.includes('theme') || lastMessage.includes('about') || lastMessage.includes('meaning')) {
    return `I hear the deeper meaning. Noting [THEME: Core Message | ${userContent.slice(0, 30)}...].

How does this theme manifest in your characters' choices?`
  }

  return `I'm picking up on something here. Let me mark [IDEA: Story Element | ${userContent.slice(0, 30)}...].

What's the feeling you want readers to have? Tell me more about what happens next.`
}
