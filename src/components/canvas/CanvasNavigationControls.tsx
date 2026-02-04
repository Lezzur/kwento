// =============================================================================
// KWENTO - Canvas Navigation Controls
// Helps users navigate large canvases and find cards
// =============================================================================

'use client'

import { useReactFlow } from '@xyflow/react'
import { useStore } from '@/store'

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function CanvasNavigationControls() {
  const { fitView, setCenter, zoomTo } = useReactFlow()
  const { showCanvasBoundary, setShowCanvasBoundary } = useStore()

  // Fit all nodes in view
  const handleFitView = () => {
    fitView({ padding: 0.2, duration: 400 })
  }

  // Reset to canvas origin
  const handleRecenter = () => {
    setCenter(0, 0, { zoom: 1, duration: 400 })
  }

  // Zoom to 100%
  const handleResetZoom = () => {
    zoomTo(1, { duration: 300 })
  }

  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
      {/* Navigation Controls */}
      <div className="bg-kwento-bg-secondary rounded-lg border border-kwento-bg-tertiary shadow-lg overflow-hidden">
        <button
          onClick={handleFitView}
          className="w-full px-4 py-2.5 text-left text-xs font-medium text-kwento-text-primary hover:bg-kwento-bg-tertiary transition-colors border-b border-kwento-bg-tertiary flex items-center gap-2"
          title="Zoom to fit all cards in view"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-kwento-accent">
            <path d="M3 3h7v2H5v5H3V3zm18 0h-7v2h5v5h2V3zM3 21h7v-2H5v-5H3v7zm18 0h-7v-2h5v-5h2v7z" fill="currentColor"/>
          </svg>
          Fit All Cards
        </button>

        <button
          onClick={handleRecenter}
          className="w-full px-4 py-2.5 text-left text-xs font-medium text-kwento-text-primary hover:bg-kwento-bg-tertiary transition-colors border-b border-kwento-bg-tertiary flex items-center gap-2"
          title="Return to canvas center (0,0)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-kwento-accent">
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Recenter
        </button>

        <button
          onClick={handleResetZoom}
          className="w-full px-4 py-2.5 text-left text-xs font-medium text-kwento-text-primary hover:bg-kwento-bg-tertiary transition-colors flex items-center gap-2"
          title="Reset zoom to 100%"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-kwento-accent">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 16l5 5M11 8v6M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Reset Zoom (100%)
        </button>
      </div>

      {/* Boundary Toggle */}
      <div className="bg-kwento-bg-secondary rounded-lg border border-kwento-bg-tertiary shadow-lg overflow-hidden">
        <button
          onClick={() => setShowCanvasBoundary(!showCanvasBoundary)}
          className={`w-full px-4 py-2.5 text-left text-xs font-medium transition-colors flex items-center gap-2 ${
            showCanvasBoundary
              ? 'bg-kwento-accent text-kwento-bg-primary'
              : 'text-kwento-text-primary hover:bg-kwento-bg-tertiary'
          }`}
          title="Toggle workspace boundary visibility"
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
