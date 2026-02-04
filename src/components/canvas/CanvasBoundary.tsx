// =============================================================================
// KWENTO - Canvas Boundary
// Visual workspace boundary to help organize cards
// =============================================================================

'use client'

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

interface CanvasBoundaryProps {
  width?: number
  height?: number
  centerX?: number
  centerY?: number
}

export default function CanvasBoundary({
  width = 4000,
  height = 3000,
  centerX = 0,
  centerY = 0,
}: CanvasBoundaryProps) {
  // Calculate boundary edges
  const left = centerX - width / 2
  const top = centerY - height / 2

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: '2px dashed rgba(245, 158, 11, 0.3)',
        borderRadius: '8px',
        zIndex: 0,
      }}
    >
      {/* Corner labels */}
      <div className="absolute -top-6 left-0 text-xs text-kwento-accent opacity-50">
        Workspace Boundary ({width} × {height})
      </div>

      {/* Grid markers at edges */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2">
        <div className="w-6 h-px bg-kwento-accent opacity-30" />
      </div>
      <div className="absolute -right-8 top-1/2 -translate-y-1/2">
        <div className="w-6 h-px bg-kwento-accent opacity-30" />
      </div>
      <div className="absolute -top-8 left-1/2 -translate-x-1/2">
        <div className="h-6 w-px bg-kwento-accent opacity-30" />
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
        <div className="h-6 w-px bg-kwento-accent opacity-30" />
      </div>
    </div>
  )
}
