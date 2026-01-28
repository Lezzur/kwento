// =============================================================================
// KWENTO - Chat Message Component
// =============================================================================

import type { Message } from '@/types'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] rounded-lg px-3 py-2 text-sm
          ${isUser
            ? 'bg-kwento-accent text-kwento-bg-primary'
            : 'bg-kwento-bg-tertiary text-kwento-text-primary'
          }
        `}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <span
          className={`
            text-[10px] mt-1 block
            ${isUser ? 'text-kwento-bg-secondary/70' : 'text-kwento-text-secondary'}
          `}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  )
}
