// =============================================================================
// KWENTO - Reset Button (Top Nav)
// =============================================================================

'use client'

import { useState, useCallback } from 'react'
import { useStore } from '@/store'
import { clearProjectData } from '@/lib/db'
import ResetConfirmDialog from './ResetConfirmDialog'

// -----------------------------------------------------------------------------
// Reset Icon
// -----------------------------------------------------------------------------

function ResetIcon({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function ResetButton() {
  const [showDialog, setShowDialog] = useState(false)
  const { activeProjectId, resetProjectData, setElements, setConnections } = useStore()

  const handleReset = useCallback(async () => {
    if (!activeProjectId) return

    // Clear from database
    await clearProjectData(activeProjectId)

    // Clear from store
    resetProjectData()

    // Force clear elements and connections in store
    setElements([])
    setConnections([])
  }, [activeProjectId, resetProjectData, setElements, setConnections])

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="p-2 rounded-lg transition-colors
          text-kwento-text-secondary hover:text-red-400 hover:bg-red-500/10"
        title="Reset project"
      >
        <ResetIcon className="w-5 h-5" />
      </button>

      <ResetConfirmDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleReset}
      />
    </>
  )
}
