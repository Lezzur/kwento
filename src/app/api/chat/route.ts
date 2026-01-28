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

    if (AI_PROVIDER === 'anthropic' && ANTHROPIC_API_KEY) {
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

// Fallback responses for development without API keys
function getFallbackResponse(messages: ChatMessage[]): string {
  const lastMessage = messages[messages.length - 1].content.toLowerCase()

  if (messages.length === 1) {
    return `Interesting! I'm picking up some ideas here. Let me organize what I'm seeing:

- You mentioned: "${messages[0].content.slice(0, 50)}..."

Tell me more - who are the main characters? What's the central conflict or tension in this story?

*(Note: Running in demo mode. Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env.local for full AI)*`
  }

  if (lastMessage.includes('character')) {
    return `Great, let's dig into this character more. What drives them? What do they want more than anything, and what's standing in their way?`
  }

  if (lastMessage.includes('scene') || lastMessage.includes('setting')) {
    return `I can visualize that setting. What emotional tone does this place carry? Is it a place of safety, danger, mystery?`
  }

  if (lastMessage.includes('plot') || lastMessage.includes('conflict')) {
    return `That's a compelling conflict. How does this tension escalate? What's at stake if things go wrong?`
  }

  return `I hear you. Let me ask - what's the feeling you want readers to have when they experience this part of the story?

Is there a specific scene or character you'd like to explore further?`
}
