// =============================================================================
// KWENTO - Canvas Navigation Controls
// Additional controls to complement React Flow's built-in controls
// =============================================================================

'use client'

import { useReactFlow } from '@xyflow/react'
import { useStore } from '@/store'

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function CanvasNavigationControls() {
  const { setCenter } = useReactFlow()
  const { showCanvasBoundary, setShowCanvasBoundary } = useStore()

  // Reset to canvas origin
  const handleRecenter = () => {
    setCenter(0, 0, { zoom: 1, duration: 400 })
  }

  return (
    <div className="absolute bottom-[180px] left-4 z-10 flex flex-col gap-2">
      {/* Combined Navigation Panel */}
      <div className="bg-kwento-bg-secondary rounded-lg border border-kwento-bg-tertiary shadow-lg overflow-hidden">
        <button
          onClick={handleRecenter}
          className="w-full px-4 py-2 text-left text-xs font-medium text-kwento-text-primary hover:bg-kwento-bg-tertiary transition-colors border-b border-kwento-bg-tertiary flex items-center gap-2"
          title="Return to canvas origin (0,0)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-kwento-accent">
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Recenter Origin
        </button>

        <button
          onClick={() => setShowCanvasBoundary(!showCanvasBoundary)}
          className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors flex items-center gap-2 ${
            showCanvasBoundary
              ? 'bg-kwento-accent text-kwento-bg-primary'
              : 'text-kwento-text-primary hover:bg-kwento-bg-tertiary'
          }`}
          title="Toggle workspace boundary (4000×3000)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={showCanvasBoundary ? 'text-kwento-bg-primary' : 'text-kwento-accent'}>
            <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
          </svg>
          {showCanvasBoundary ? 'Hide Boundary' : 'Show Boundary'}
        </button>
      </div>
    </div>
  )
}
