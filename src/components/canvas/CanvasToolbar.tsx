// =============================================================================
// KWENTO - Canvas Toolbar
// =============================================================================

import type { ElementType, Layer } from '@/types'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CanvasToolbarProps {
  onAddElement: (type: ElementType) => void
  activeLayers: Layer[]
  onToggleLayer: (layer: Layer) => void
}

// Element options for the toolbar
const elementOptions: { type: ElementType; icon: string; label: string }[] = [
  { type: 'scene', icon: '🎬', label: 'Scene' },
  { type: 'character', icon: '👤', label: 'Character' },
  { type: 'location', icon: '📍', label: 'Location' },
  { type: 'plot-point', icon: '⭐', label: 'Plot Point' },
  { type: 'idea', icon: '💡', label: 'Idea' },
  { type: 'chapter', icon: '📖', label: 'Chapter' },
  { type: 'conflict', icon: '⚡', label: 'Conflict' },
  { type: 'theme', icon: '🎭', label: 'Theme' },
  { type: 'note', icon: '📝', label: 'Note' },
]

// Layer options
const layerOptions: { layer: Layer; label: string }[] = [
  { layer: 'all', label: 'All' },
  { layer: 'characters', label: 'Characters' },
  { layer: 'scenes', label: 'Scenes' },
  { layer: 'plot', label: 'Plot' },
  { layer: 'locations', label: 'Locations' },
  { layer: 'themes', label: 'Themes' },
]

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function CanvasToolbar({
  onAddElement,
  activeLayers,
  onToggleLayer,
}: CanvasToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-3">
      {/* Add Elements Panel */}
      <div className="bg-kwento-bg-secondary rounded-lg border border-kwento-bg-tertiary p-3 shadow-lg">
        <h3 className="text-xs font-semibold text-kwento-text-secondary uppercase tracking-wide mb-2">
          Add Element
        </h3>
        <div className="grid grid-cols-3 gap-1">
          {elementOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => onAddElement(option.type)}
              className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-kwento-bg-tertiary transition-colors group"
              title={option.label}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {option.icon}
              </span>
              <span className="text-[10px] text-kwento-text-secondary">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Layers Panel */}
      <div className="bg-kwento-bg-secondary rounded-lg border border-kwento-bg-tertiary p-3 shadow-lg">
        <h3 className="text-xs font-semibold text-kwento-text-secondary uppercase tracking-wide mb-2">
          Layers
        </h3>
        <div className="flex flex-col gap-1">
          {layerOptions.map((option) => {
            const isActive = activeLayers.includes(option.layer)
            return (
              <button
                key={option.layer}
                onClick={() => onToggleLayer(option.layer)}
                className={`
                  px-3 py-1.5 rounded text-xs text-left transition-colors
                  ${isActive
                    ? 'bg-kwento-accent text-kwento-bg-primary font-medium'
                    : 'text-kwento-text-secondary hover:bg-kwento-bg-tertiary'
                  }
                `}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
