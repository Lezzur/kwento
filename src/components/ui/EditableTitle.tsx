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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== value) {
      onSave(trimmed)
    } else {
      setEditValue(value)
    }
    setIsEditing(false)
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
        className={`bg-transparent border-b border-kwento-text-tertiary focus:border-kwento-text-secondary outline-none ${className}`}
      />
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={`hover:text-kwento-text-primary transition-colors cursor-text text-left ${className}`}
      title="Click to edit"
    >
      {value || placeholder}
    </button>
  )
}
