// =============================================================================
// KWENTO - Card Reference Sidebar (Writing View)
// =============================================================================

'use client'

import { useState } from 'react'
import { useStore } from '@/store'
import type { Editor } from '@tiptap/react'

type CardFilter = 'all' | 'character' | 'location' | 'scene' | 'plot-point' | 'note'

interface CardReferenceSidebarProps {
  editor?: Editor | null
}

export default function CardReferenceSidebar({ editor }: CardReferenceSidebarProps) {
  const { elements, setCurrentView } = useStore()
  const [filter, setFilter] = useState<CardFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pinnedCards, setPinnedCards] = useState<string[]>([])

  // Separate pinned and unpinned elements
  const allFilteredElements = elements.filter((el) => {
    const matchesFilter = filter === 'all' || el.type === filter
    const matchesSearch = searchQuery === '' ||
      el.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.content?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const pinnedElements = allFilteredElements.filter((el) => pinnedCards.includes(el.id))
  const unpinnedElements = allFilteredElements.filter((el) => !pinnedCards.includes(el.id))

  // Handle pin/unpin
  const togglePin = (elementId: string) => {
    setPinnedCards((prev) =>
      prev.includes(elementId)
        ? prev.filter((id) => id !== elementId)
        : [...prev, elementId]
    )
  }

  // Handle insert reference
  const insertReference = (elementTitle: string) => {
    if (!editor) return
    editor.chain().focus().insertContent(`[[${elementTitle}]] `).run()
  }

  // Handle jump to canvas
  const jumpToCanvas = (elementId: string) => {
    const element = elements.find((el) => el.id === elementId)
    if (element) {
      // Select the element
      useStore.getState().setSelectedElements([elementId])
      // Center the viewport on the element
      useStore.getState().setViewportCenter(element.position)
    }
    setCurrentView('canvas')
  }

  return (
    <div className="h-full flex flex-col bg-kwento-bg-secondary">
      {/* Header */}
      <div className="border-b border-kwento-bg-tertiary px-4 py-3">
        <h3 className="text-sm font-semibold text-kwento-text-primary mb-3">References</h3>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search elements..."
          className="w-full px-3 py-1.5 bg-kwento-bg-tertiary border border-kwento-bg-tertiary rounded text-sm text-kwento-text-primary placeholder-kwento-text-secondary focus:outline-none focus:border-kwento-accent"
        />
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-kwento-bg-tertiary px-2 py-2 flex items-center gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-kwento-bg-tertiary scrollbar-track-transparent">
        <FilterTab
          label="All"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          count={elements.length}
        />
        <FilterTab
          label="Characters"
          active={filter === 'character'}
          onClick={() => setFilter('character')}
          count={elements.filter((el) => el.type === 'character').length}
        />
        <FilterTab
          label="Locations"
          active={filter === 'location'}
          onClick={() => setFilter('location')}
          count={elements.filter((el) => el.type === 'location').length}
        />
        <FilterTab
          label="Scenes"
          active={filter === 'scene'}
          onClick={() => setFilter('scene')}
          count={elements.filter((el) => el.type === 'scene').length}
        />
      </div>

      {/* Card List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Pinned Cards */}
        {pinnedElements.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-kwento-text-secondary uppercase font-semibold px-2 py-1 flex items-center gap-2">
              <span>📌</span>
              <span>Pinned</span>
            </div>
            {pinnedElements.map((element) => (
              <ReferenceCard
                key={element.id}
                element={element}
                isPinned={true}
                onTogglePin={togglePin}
                onInsertReference={insertReference}
                onJumpToCanvas={jumpToCanvas}
              />
            ))}
          </div>
        )}

        {/* Unpinned Cards */}
        {unpinnedElements.length === 0 && pinnedElements.length === 0 ? (
          <div className="text-center text-kwento-text-secondary text-sm py-8">
            {searchQuery ? 'No matching elements' : 'No elements yet'}
          </div>
        ) : (
          unpinnedElements.map((element) => (
            <ReferenceCard
              key={element.id}
              element={element}
              isPinned={false}
              onTogglePin={togglePin}
              onInsertReference={insertReference}
              onJumpToCanvas={jumpToCanvas}
            />
          ))
        )}
      </div>

      {/* Footer Hint */}
      <div className="border-t border-kwento-bg-tertiary px-4 py-2 text-xs text-kwento-text-secondary">
        Click card actions to pin, insert, or jump to canvas.
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Filter Tab Component
// -----------------------------------------------------------------------------

interface FilterTabProps {
  label: string
  active: boolean
  onClick: () => void
  count: number
}

function FilterTab({ label, active, onClick, count }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-2 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0
        ${active
          ? 'bg-kwento-accent text-white'
          : 'text-kwento-text-secondary hover:text-kwento-text-primary hover:bg-kwento-bg-tertiary'
        }
      `}
    >
      {label} ({count})
    </button>
  )
}

// -----------------------------------------------------------------------------
// Reference Card Component
// -----------------------------------------------------------------------------

interface ReferenceCardProps {
  element: any
  isPinned: boolean
  onTogglePin: (id: string) => void
  onInsertReference: (title: string) => void
  onJumpToCanvas: (id: string) => void
}

function ReferenceCard({
  element,
  isPinned,
  onTogglePin,
  onInsertReference,
  onJumpToCanvas,
}: ReferenceCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="bg-kwento-bg-tertiary/50 border border-kwento-bg-tertiary rounded overflow-hidden hover:bg-kwento-bg-tertiary transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Card Header */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="text-xs text-kwento-text-secondary uppercase mb-1">{element.type}</div>
            <div className="text-sm font-medium text-kwento-text-primary">{element.title}</div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-kwento-text-secondary hover:text-kwento-text-primary px-2"
          >
            {expanded ? '−' : '+'}
          </button>
        </div>

        {/* Card Content (Expanded) */}
        {expanded && element.content && (
          <div className="mt-2 pt-2 border-t border-kwento-bg-tertiary text-xs text-kwento-text-secondary whitespace-pre-wrap">
            {element.content}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="border-t border-kwento-bg-tertiary p-2 flex items-center gap-1">
          <ActionButton
            icon={isPinned ? '📌' : '📍'}
            label={isPinned ? 'Unpin' : 'Pin'}
            onClick={() => onTogglePin(element.id)}
          />
          <ActionButton
            icon="➕"
            label="Insert"
            onClick={() => onInsertReference(element.title)}
          />
          <ActionButton
            icon="🎨"
            label="Canvas"
            onClick={() => onJumpToCanvas(element.id)}
          />
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Action Button Component
// -----------------------------------------------------------------------------

interface ActionButtonProps {
  icon: string
  label: string
  onClick: () => void
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-kwento-bg-secondary hover:bg-kwento-bg-tertiary text-xs text-kwento-text-primary transition-colors"
      title={label}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
