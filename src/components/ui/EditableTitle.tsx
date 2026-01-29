// =============================================================================
// KWENTO - Editable Title Component
// =============================================================================

'use client'

import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react'

interface EditableTitleProps {
  value: string
  onSave: (value: string) => void
  placeholder?: string
  className?: string
}

export function EditableTitle({
  value,
  onSave,
  placeholder = 'Untitled Project',
  className = '',
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  // Track the value we started editing - only save if it still matches
  const originalValueRef = useRef(value)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    // When value changes externally (e.g., switching projects), sync state
    setEditValue(value)
    // Cancel any pending edit since we switched context
    setIsEditing(false)
    // Update the ref so handleSave knows not to save stale data
    originalValueRef.current = value
  }, [value])

  const handleSave = () => {
    const trimmed = editValue.trim()

    // CRITICAL: Only save if the original value matches what we started with
    // This prevents saving to wrong project when switching during edit
    if (originalValueRef.current !== value) {
      // Value changed externally, don't save
      setEditValue(value)
      setIsEditing(false)
      return
    }

    if (trimmed && trimmed !== value) {
      onSave(trimmed)
    } else {
      setEditValue(value)
    }
    setIsEditing(false)
  }

  const handleStartEdit = () => {
    // Record the value we're starting to edit
    originalValueRef.current = value
    setIsEditing(true)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setEditValue(value)
      setIsEditing(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={handleChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-kwento-bg-tertiary/50 rounded px-1 -mx-1 outline-none focus-visible:outline-none ${className}`}
      />
    )
  }

  return (
    <button
      onClick={handleStartEdit}
      className={`hover:text-kwento-text-primary transition-colors cursor-text text-left ${className}`}
      title="Click to edit"
    >
      {value || placeholder}
    </button>
  )
}
