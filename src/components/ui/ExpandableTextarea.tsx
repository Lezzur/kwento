// =============================================================================
// KWENTO - Expandable Textarea Component
// =============================================================================

'use client'

import { useState, useRef, useEffect } from 'react'

interface ExpandableTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  rows?: number
}

export default function ExpandableTextarea({
  value,
  onChange,
  placeholder,
  label,
  rows = 2,
}: ExpandableTextareaProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const expandedRef = useRef<HTMLTextAreaElement>(null)

  // Sync local value when prop changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Focus expanded textarea when opened
  useEffect(() => {
    if (isExpanded && expandedRef.current) {
      expandedRef.current.focus()
      expandedRef.current.selectionStart = expandedRef.current.value.length
    }
  }, [isExpanded])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  const handleClose = () => {
    onChange(localValue)
    setIsExpanded(false)
  }

  return (
    <>
      {/* Inline textarea with expand button */}
      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-2 py-1.5 pr-7 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-xs text-kwento-text-primary placeholder:text-kwento-text-secondary focus:outline-none focus:ring-1 focus:ring-kwento-accent resize-none"
        />
        <button
          onClick={() => setIsExpanded(true)}
          className="absolute top-1.5 right-1.5 p-0.5 text-kwento-text-secondary hover:text-kwento-text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          title="Expand"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>

      {/* Expanded modal */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="w-[90%] max-w-2xl bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-kwento-bg-tertiary">
              <span className="text-sm font-medium text-kwento-text-primary">
                {label || 'Edit'}
              </span>
              <button
                onClick={handleClose}
                className="p-1 text-kwento-text-secondary hover:text-kwento-text-primary transition-colors"
                title="Close (Esc)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Textarea */}
            <div className="p-4">
              <textarea
                ref={expandedRef}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={placeholder}
                className="w-full h-64 px-3 py-2 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-sm text-kwento-text-primary placeholder:text-kwento-text-secondary focus:outline-none focus:ring-1 focus:ring-kwento-accent resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end px-4 py-3 border-t border-kwento-bg-tertiary">
              <button
                onClick={handleClose}
                className="px-4 py-1.5 bg-kwento-accent text-kwento-bg-primary text-xs font-medium rounded hover:bg-kwento-accent-secondary transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
