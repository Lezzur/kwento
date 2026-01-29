// =============================================================================
// KWENTO - Reusable Confirmation Dialog
// =============================================================================

'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
  onCancel: () => void
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onCancel()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const variantColors = {
    danger: {
      icon: 'text-red-500',
      iconBg: 'bg-red-500/10',
      button: 'bg-red-600 hover:bg-red-700',
    },
    warning: {
      icon: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: 'text-blue-500',
      iconBg: 'bg-blue-500/10',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  }[variant]

  // Use portal to render dialog at document body level, avoiding canvas clipping
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative bg-kwento-bg-secondary rounded-xl border border-kwento-bg-tertiary shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-kwento-bg-tertiary">
          <div className={`p-2 rounded-full ${variantColors.iconBg}`}>
            <svg
              className={`w-5 h-5 ${variantColors.icon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-kwento-text-primary">
            {title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-kwento-text-secondary">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-0">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg text-sm font-medium
              text-kwento-text-secondary hover:text-kwento-text-primary
              bg-kwento-bg-tertiary hover:bg-kwento-bg-tertiary/80
              transition-colors"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${variantColors.button}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
