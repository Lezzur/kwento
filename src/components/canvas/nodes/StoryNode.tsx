// =============================================================================
// KWENTO - Story Node Component (Base node for all element types)
// =============================================================================

import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { ElementType } from '@/types'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface StoryNodeData extends Record<string, unknown> {
  type: ElementType
  title: string
  content?: string
  color?: string
}

interface StoryNodeProps {
  data: StoryNodeData
  selected?: boolean
}

// Element type configuration
const elementConfig: Record<ElementType, { icon: string; defaultColor: string; label: string }> = {
  scene: { icon: '🎬', defaultColor: '#F59E0B', label: 'Scene' },
  character: { icon: '👤', defaultColor: '#8B5CF6', label: 'Character' },
  location: { icon: '📍', defaultColor: '#10B981', label: 'Location' },
  'plot-point': { icon: '⭐', defaultColor: '#EF4444', label: 'Plot Point' },
  idea: { icon: '💡', defaultColor: '#FACC15', label: 'Idea' },
  chapter: { icon: '📖', defaultColor: '#3B82F6', label: 'Chapter' },
  conflict: { icon: '⚡', defaultColor: '#EC4899', label: 'Conflict' },
  theme: { icon: '🎭', defaultColor: '#6366F1', label: 'Theme' },
  note: { icon: '📝', defaultColor: '#6B7280', label: 'Note' },
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

function StoryNode({ data, selected }: StoryNodeProps) {
  const config = elementConfig[data.type] || elementConfig.note
  const bgColor = data.color || config.defaultColor

  return (
    <div
      className={`
        relative min-w-[140px] max-w-[200px] rounded-md border shadow-md
        transition-all duration-150 cursor-pointer
        ${selected ? 'ring-2 ring-kwento-accent ring-offset-1 ring-offset-kwento-bg-primary' : ''}
      `}
      style={{
        borderColor: bgColor,
        backgroundColor: 'var(--color-kwento-bg-secondary)',
      }}
    >
      {/* Header */}
      <div
        className="px-2 py-1.5 rounded-t flex items-center gap-1.5"
        style={{ backgroundColor: `${bgColor}20` }}
      >
        <span className="text-xs">{config.icon}</span>
        <span
          className="text-[10px] font-medium uppercase tracking-wide"
          style={{ color: bgColor }}
        >
          {config.label}
        </span>
      </div>

      {/* Content */}
      <div className="px-2 py-2">
        <h3 className="text-xs font-medium text-kwento-text-primary leading-tight">
          {data.title || 'Untitled'}
        </h3>
        {data.content && (
          <p className="mt-1 text-[10px] text-kwento-text-secondary line-clamp-2">
            {data.content}
          </p>
        )}
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-kwento-bg-tertiary !border hover:!bg-kwento-accent transition-colors"
        style={{ borderColor: bgColor }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-kwento-bg-tertiary !border hover:!bg-kwento-accent transition-colors"
        style={{ borderColor: bgColor }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2 !h-2 !bg-kwento-bg-tertiary !border hover:!bg-kwento-accent transition-colors"
        style={{ borderColor: bgColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2 !h-2 !bg-kwento-bg-tertiary !border hover:!bg-kwento-accent transition-colors"
        style={{ borderColor: bgColor }}
      />
    </div>
  )
}

export default memo(StoryNode)
