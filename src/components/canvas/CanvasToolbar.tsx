// =============================================================================
// KWENTO - Canvas Toolbar
// =============================================================================

import type { ElementType, Layer, CustomCardType } from '@/types'
import { ElementIcon, DynamicIcon } from '@/components/icons/StoryIcons'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CanvasToolbarProps {
  onAddElement: (type: ElementType) => void
  onAddCustomElement: (customType: CustomCardType) => void
  customCardTypes: CustomCardType[]
  activeLayers: Layer[]
  onToggleLayer: (layer: Layer) => void
}

// Element options for the toolbar
const elementOptions: { type: ElementType; label: string }[] = [
  { type: 'scene', label: 'Scene' },
  { type: 'character', label: 'Character' },
  { type: 'location', label: 'Location' },
  { type: 'plot-point', label: 'Plot Point' },
  { type: 'idea', label: 'Idea' },
  { type: 'chapter', label: 'Chapter' },
  { type: 'conflict', label: 'Conflict' },
  { type: 'theme', label: 'Theme' },
  { type: 'note', label: 'Note' },
]

// Layer options
const layerOptions: { layer: Layer; label: string }[] = [
  { layer: 'all', label: 'All' },
  { layer: 'characters', label: 'Characters' },
  { layer: 'scenes', label: 'Scenes' },
  { layer: 'plot', label: 'Plot' },
  { layer: 'locations', label: 'Locations' },
  { layer: 'themes', label: 'Themes' },
  { layer: 'custom', label: 'Custom' },
]

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function CanvasToolbar({
  onAddElement,
  onAddCustomElement,
  customCardTypes,
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
              <ElementIcon
                type={option.type}
                size={18}
                className="text-kwento-text-secondary group-hover:text-kwento-accent group-hover:scale-110 transition-all"
              />
              <span className="text-[10px] text-kwento-text-secondary">
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Custom Card Types */}
        {customCardTypes.length > 0 && (
          <>
            <div className="border-t border-kwento-bg-tertiary my-2" />
            <h4 className="text-[10px] font-medium text-kwento-text-muted uppercase tracking-wide mb-1.5">
              Custom Types
            </h4>
            <div className="grid grid-cols-3 gap-1">
              {customCardTypes.map((customType) => (
                <button
                  key={customType.id}
                  onClick={() => onAddCustomElement(customType)}
                  className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-kwento-bg-tertiary transition-colors group"
                  title={customType.name}
                >
                  <DynamicIcon
                    name={customType.icon}
                    size={18}
                    className="group-hover:scale-110 transition-all"
                    style={{ color: customType.color }}
                  />
                  <span className="text-[10px] text-kwento-text-secondary truncate max-w-full">
                    {customType.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
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
