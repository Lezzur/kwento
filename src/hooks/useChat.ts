// =============================================================================
// KWENTO - useChat Hook
// =============================================================================

import { useState, useCallback, useEffect } from 'react'
import { db, generateId, now } from '@/lib/db'
import { useStore } from '@/store'
import type { Message, Conversation } from '@/types'

const SYSTEM_PROMPT = `You are Kwento, an AI story development assistant. Your role is to help writers extract and organize their story ideas.

CORE BEHAVIORS:
1. EXTRACT, not invent - Pull ideas FROM the user, don't inject your own
2. QUESTION, not lecture - Use questions to guide, not explanations
3. ORGANIZE, not overwhelm - Structure input incrementally
4. SUGGEST gently - "What if..." not "You should..."
5. REMEMBER context - Reference earlier parts of conversation

When the user shares ideas, you should:
- Identify characters, scenes, conflicts, settings from their input
- Organize what you're picking up into clear elements
- Ask clarifying questions that reveal the story
- Offer suggestions only when invited or when user seems stuck

Format your responses conversationally but include clear element identification when relevant.
Use markdown formatting sparingly - keep it readable in a chat interface.`

export function useChat() {
  const { activeProjectId } = useStore()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load or create conversation for active project
  useEffect(() => {
    if (!activeProjectId) return

    const loadConversation = async () => {
      // Try to find existing conversation
      const existing = await db.conversations
        .where('projectId')
        .equals(activeProjectId)
        .first()

      if (existing) {
        setConversation(existing)
        setMessages(existing.messages)
      } else {
        // Create new conversation
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

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      // Create user message
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
        // Call AI API
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

        // Create assistant message
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.content,
          timestamp: now(),
        }

        const finalMessages = [...updatedMessages, assistantMessage]
        setMessages(finalMessages)
        await saveMessages(finalMessages)
      } catch (error) {
        console.error('Chat error:', error)
        // Add error message
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
    [messages, saveMessages]
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
