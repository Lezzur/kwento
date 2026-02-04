// =============================================================================
// KWENTO - useChat Hook
// =============================================================================

import { useState, useCallback, useEffect } from 'react'
import { db, generateId, now, createCanvasElement } from '@/lib/db'
import { useStore } from '@/store'
import { extractElements, cleanResponseText } from '@/lib/elementExtractor'
import type { Message, Conversation, CanvasElement } from '@/types'

const SYSTEM_PROMPT = `You are Kwento, an AI story development assistant. Your role is to help writers extract and organize their story ideas.

CORE BEHAVIORS:
1. EXTRACT, not invent - Pull ideas FROM the user, don't inject your own
2. QUESTION, not lecture - Use questions to guide, not explanations
3. ORGANIZE, not overwhelm - Structure input incrementally
4. SUGGEST gently - "What if..." not "You should..."
5. REMEMBER context - Reference earlier parts of conversation

ELEMENT EXTRACTION:
When you identify a story element from the user's input, mark it using this format:
[TYPE: Title] or [TYPE: Title | Brief description]

Available types:
- CHARACTER: A person/being in the story
- SCENE: A specific moment or event
- LOCATION: A place in the story world
- PLOT-POINT: A key story beat or turning point
- CONFLICT: A source of tension
- THEME: A recurring idea or message
- IDEA: A general concept to explore
- NOTE: Miscellaneous information

CRITICAL - Each mention is UNIQUE:
- Create SEPARATE cards for each distinct reference, even if related
- "Tony Stark" and "Iron Man" = 2 separate CHARACTER cards
- "London" and "Post-Flood London" = 2 separate LOCATION cards
- "Young Sarah" and "Adult Sarah" = 2 separate CHARACTER cards
- NEVER consolidate or merge - treat each as unique

Example response:
"I'm picking up some great elements here! You've got [CHARACTER: Marcus | A gruff veteran haunted by his past] and it sounds like there's a [CONFLICT: Father vs Son | Generational tension over family legacy].

What drives Marcus? What does he want more than anything?"

Only mark elements when you're confident they're distinct story components the user has shared. Don't over-extract - quality over quantity.`

export function useChat() {
  const { activeProjectId, addElement, viewportCenter } = useStore()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load or create conversation for active project
  useEffect(() => {
    if (!activeProjectId) return

    const loadConversation = async () => {
      const existing = await db.conversations
        .where('projectId')
        .equals(activeProjectId)
        .first()

      if (existing) {
        setConversation(existing)
        setMessages(existing.messages)
      } else {
        const newConversation: Conversation = {
          id: generateId(),
          projectId: activeProjectId,
          messages: [],
          createdAt: now(),
          updatedAt: now(),
        }
        await db.conversations.add(newConversation)
        setConversation(newConversation)
        setMessages([])
      }
    }

    loadConversation()
  }, [activeProjectId])

  // Save messages to database
  const saveMessages = useCallback(
    async (updatedMessages: Message[]) => {
      if (!conversation) return
      await db.conversations.update(conversation.id, {
        messages: updatedMessages,
        updatedAt: now(),
      })
    },
    [conversation]
  )

  // Create canvas elements from extracted data
  const createExtractedElements = useCallback(
    async (responseText: string, messageId: string) => {
      if (!activeProjectId) return []

      const extracted = extractElements(responseText)
      console.log('[Card Creation] Extracted elements:', extracted)
      const createdIds: string[] = []

      // Spawn all cards at the exact center of the viewport
      const centerX = viewportCenter.x
      const centerY = viewportCenter.y

      for (let i = 0; i < extracted.length; i++) {
        const element = extracted[i]

        // Map element type to layer
        const layerMap: Record<string, CanvasElement['layer']> = {
          character: 'characters',
          scene: 'scenes',
          location: 'locations',
          'plot-point': 'plot',
          conflict: 'plot',
          theme: 'themes',
          idea: 'all',
          chapter: 'scenes',
          note: 'all',
        }

        const canvasElement = await createCanvasElement(
          activeProjectId,
          element.type,
          element.title,
          { x: centerX, y: centerY },
          layerMap[element.type] || 'all'
        )

        // Update content if provided
        if (element.content) {
          await db.canvasElements.update(canvasElement.id, {
            content: element.content,
          })
          canvasElement.content = element.content
        }

        // Add to store for immediate display
        addElement(canvasElement)
        createdIds.push(canvasElement.id)
      }

      return createdIds
    },
    [activeProjectId, addElement, viewportCenter]
  )

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: now(),
      }

      const updatedMessages = [...messages, userMessage]
      setMessages(updatedMessages)
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            systemPrompt: SYSTEM_PROMPT,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get AI response')
        }

        const data = await response.json()
        const responseContent = data.content

        // Extract elements and create on canvas
        const extractedIds = await createExtractedElements(
          responseContent,
          generateId()
        )

        // Create assistant message with extracted element IDs
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: cleanResponseText(responseContent),
          timestamp: now(),
          extractedElements: extractedIds.length > 0 ? extractedIds : undefined,
        }

        const finalMessages = [...updatedMessages, assistantMessage]
        setMessages(finalMessages)
        await saveMessages(finalMessages)
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: now(),
        }
        const finalMessages = [...updatedMessages, errorMessage]
        setMessages(finalMessages)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, saveMessages, createExtractedElements]
  )

  // Clear conversation
  const clearConversation = useCallback(async () => {
    if (!conversation) return
    setMessages([])
    await db.conversations.update(conversation.id, {
      messages: [],
      updatedAt: now(),
    })
  }, [conversation])

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  }
}
