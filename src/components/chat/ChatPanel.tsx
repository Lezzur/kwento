// =============================================================================
// KWENTO - Chat Panel Component
// =============================================================================

'use client'

import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import { useChat } from '@/hooks/useChat'

export default function ChatPanel() {
  const [input, setInput] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, sendMessage } = useChat()

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    await sendMessage(userMessage)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <aside className={`flex-shrink-0 border-l border-kwento-bg-tertiary bg-kwento-bg-secondary flex flex-col transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
      {/* Chat Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-kwento-bg-tertiary">
        {!isCollapsed && (
          <>
            <h2 className="text-sm font-medium text-kwento-text-secondary">Writing Assistant</h2>
            <span className="text-xs text-kwento-text-secondary">
              {messages.length} messages
            </span>
          </>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto text-kwento-text-secondary hover:text-kwento-text-primary transition-colors"
          title={isCollapsed ? 'Expand chat' : 'Collapse chat'}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <polyline points="9 6 6 3 3 6" transform="rotate(90 6 6)" />
          </svg>
        </button>
      </div>

      {/* Chat Messages */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 select-text">
        {messages.length === 0 ? (
          <div className="bg-kwento-bg-tertiary rounded-lg p-3 text-sm text-kwento-text-secondary select-text">
            <p>Hey! What&apos;s the story that&apos;s been brewing in your mind?</p>
            <p className="mt-2">Just share whatever comes to you - scenes, characters, vibes, anything.</p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-kwento-bg-tertiary rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-kwento-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-kwento-text-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-kwento-text-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      )}

      {/* Chat Input */}
      {!isCollapsed && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-kwento-bg-tertiary">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your ideas..."
            rows={1}
            className="flex-1 px-3 py-2 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded-lg text-sm text-kwento-text-primary placeholder:text-kwento-text-secondary focus:outline-none focus:ring-2 focus:ring-kwento-accent focus:border-transparent resize-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-kwento-accent text-kwento-bg-primary rounded-lg text-sm font-medium hover:bg-kwento-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
      )}
    </aside>
  )
}
