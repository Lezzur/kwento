// =============================================================================
// KWENTO - Workspace Page (Canvas + Chat)
// =============================================================================

'use client'

import dynamic from 'next/dynamic'

// Dynamic import to avoid SSR issues with React Flow
const StoryCanvas = dynamic(
  () => import('@/components/canvas/StoryCanvas'),
  { ssr: false }
)

export default function WorkspacePage() {
  return (
    <div className="h-full flex">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <StoryCanvas />
      </div>

      {/* Chat Panel (placeholder for now) */}
      <aside className="w-80 flex-shrink-0 border-l border-kwento-bg-tertiary bg-kwento-bg-secondary flex flex-col">
        {/* Chat Header */}
        <div className="h-12 flex items-center px-4 border-b border-kwento-bg-tertiary">
          <h2 className="text-sm font-medium text-kwento-text-primary">AI Assistant</h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-kwento-bg-tertiary rounded-lg p-3 text-sm text-kwento-text-secondary">
            <p>Hey! What&apos;s the story that&apos;s been brewing in your mind?</p>
            <p className="mt-2">Just share whatever comes to you - scenes, characters, vibes, anything.</p>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-kwento-bg-tertiary">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Share your ideas..."
              className="flex-1 px-3 py-2 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded-lg text-sm text-kwento-text-primary placeholder:text-kwento-text-secondary focus:outline-none focus:ring-2 focus:ring-kwento-accent focus:border-transparent"
            />
            <button className="px-4 py-2 bg-kwento-accent text-kwento-bg-primary rounded-lg text-sm font-medium hover:bg-kwento-accent-secondary transition-colors">
              Send
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
