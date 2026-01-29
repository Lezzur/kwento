// =============================================================================
// KWENTO - Reset Confirmation Dialog (2-Step)
// =============================================================================

'use client'

import { useState, useEffect, useRef } from 'react'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ResetConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

// -----------------------------------------------------------------------------
// Icons
// -----------------------------------------------------------------------------

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function ResetConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
}: ResetConfirmDialogProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Reset step when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to reset step after close animation
      const timer = setTimeout(() => setStep(1), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleStepOne = () => {
    setStep(2)
  }

  const handleFinalConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative bg-kwento-bg-secondary rounded-xl border border-kwento-bg-tertiary shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-kwento-bg-tertiary">
          <div className="p-2 rounded-full bg-red-500/10">
            <WarningIcon className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-kwento-text-primary">
              {step === 1 ? 'Reset Project?' : 'Are you absolutely sure?'}
            </h2>
            <p className="text-sm text-kwento-text-secondary">
              Step {step} of 2
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {step === 1 ? (
            <div className="space-y-3">
              <p className="text-kwento-text-secondary">
                This will permanently delete all your work:
              </p>
              <ul className="list-disc list-inside text-kwento-text-secondary text-sm space-y-1 ml-2">
                <li>All canvas elements and connections</li>
                <li>All characters and their details</li>
                <li>All chapters and written content</li>
                <li>All plot holes and notes</li>
                <li>All AI conversations</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-kwento-text-secondary">
                <span className="text-red-400 font-semibold">This action cannot be undone.</span>
              </p>
              <p className="text-kwento-text-secondary text-sm">
                All your story elements, characters, chapters, and progress will be permanently erased.
                Your project will remain but will be empty.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
              text-kwento-text-secondary hover:text-kwento-text-primary
              bg-kwento-bg-tertiary hover:bg-kwento-bg-tertiary/80
              transition-colors"
          >
            Cancel
          </button>

          {step === 1 ? (
            <button
              onClick={handleStepOne}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                text-white bg-red-600 hover:bg-red-700
                transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleFinalConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium
                text-white bg-red-600 hover:bg-red-700
                transition-colors"
            >
              Yes, Reset Everything
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
