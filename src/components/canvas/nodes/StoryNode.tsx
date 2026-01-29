// =============================================================================
// KWENTO - Story Node Component (Base node for all element types)
// =============================================================================

import { memo, useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react'
import type { ElementType, IconName } from '@/types'
import { ElementIcon, DynamicIcon } from '@/components/icons/StoryIcons'
import { useStore, type CardFont } from '@/store'
import { deleteCanvasElement, updateCanvasElement } from '@/lib/db'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useToast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

// Font family CSS mapping
const fontFamilyMap: Record<CardFont, string> = {
  system: 'Inter, system-ui, sans-serif',
  serif: 'Georgia, Cambria, serif',
  mono: 'ui-monospace, monospace',
  handwritten: 'var(--font-caveat), Caveat, cursive',
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface StoryNodeData extends Record<string, unknown> {
  type: ElementType
  title: string
  content?: string
  color?: string
  // Custom type fields
  customTypeId?: string
  customTypeName?: string
  customTypeIcon?: IconName
}

interface StoryNodeProps {
  id: string
  data: StoryNodeData
  selected?: boolean
}

// Element type configuration
const elementConfig: Record<ElementType, { defaultColor: string; label: string }> = {
  scene: { defaultColor: '#F59E0B', label: 'Scene' },
  character: { defaultColor: '#8B5CF6', label: 'Character' },
  location: { defaultColor: '#10B981', label: 'Location' },
  'plot-point': { defaultColor: '#EF4444', label: 'Plot Point' },
  idea: { defaultColor: '#FACC15', label: 'Idea' },
  chapter: { defaultColor: '#3B82F6', label: 'Chapter' },
  conflict: { defaultColor: '#EC4899', label: 'Conflict' },
  theme: { defaultColor: '#06B6D4', label: 'Theme' },
  note: { defaultColor: '#6B7280', label: 'Note' },
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

function StoryNode({ id, data, selected }: StoryNodeProps) {
  // For custom types, use the custom type info; otherwise use built-in config
  const isCustomType = !!data.customTypeId
  const config = elementConfig[data.type] || elementConfig.note
  const displayLabel = isCustomType && data.customTypeName ? data.customTypeName : config.label
  const accentColor = data.color || config.defaultColor
  const { setNodes } = useReactFlow()
  const removeElement = useStore((state) => state.removeElement)
  const updateElement = useStore((state) => state.updateElement)
  const cardFont = useStore((state) => state.cardFont)
  const autoSaveEnabled = useStore((state) => state.autoSaveEnabled)
  const autoSaveInterval = useStore((state) => state.autoSaveInterval)

  const fontFamily = useMemo(() => fontFamilyMap[cardFont], [cardFont])
  const toast = useToast()

  const [content, setContent] = useState(data.content || '')
  const [title, setTitle] = useState(data.title || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save hook for content changes
  const { save: saveContent } = useAutoSave<{ title: string; content: string }>(
    useCallback(async (data) => {
      await updateCanvasElement(id, { title: data.title, content: data.content })
    }, [id]),
    autoSaveInterval || 500
  )

  // Sync content when data changes externally
  useEffect(() => {
    setContent(data.content || '')
  }, [data.content])

  // Sync title when data changes externally
  useEffect(() => {
    setTitle(data.title || '')
  }, [data.title])

  // Delete handler
  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteCanvasElement(id)
      removeElement(id)
      toast.success('Element deleted')
    } catch {
      toast.error('Failed to delete element')
    }
    setShowDeleteConfirm(false)
  }, [id, removeElement, toast])

  // Update node data when title changes
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value
      setTitle(newTitle)

      // Update React Flow nodes
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, title: newTitle } }
            : node
        )
      )

      // Update the store's elements array (keeps state in sync)
      updateElement(id, { title: newTitle })

      // Auto-save if enabled
      if (autoSaveEnabled) {
        saveContent({ title: newTitle, content })
      }
    },
    [id, setNodes, updateElement, autoSaveEnabled, saveContent, content]
  )

  // Update node data when content changes
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value
      setContent(newContent)

      // Update React Flow nodes
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, content: newContent } }
            : node
        )
      )

      // Update the store's elements array (keeps state in sync)
      updateElement(id, { content: newContent })

      // Auto-save if enabled
      if (autoSaveEnabled) {
        saveContent({ title, content: newContent })
      }
    },
    [id, setNodes, updateElement, autoSaveEnabled, saveContent, title]
  )

  // Prevent drag when interacting with textarea
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  // Blur input on Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }, [])

  return (
    <div
      className={`
        relative w-full h-full min-w-[130px] min-h-[80px] rounded bg-kwento-bg-secondary
        border border-kwento-bg-tertiary/80 transition-all duration-150
        ${selected ? 'border-kwento-accent/50' : 'hover:border-kwento-text-secondary/30'}
      `}
    >
      {/* Node Resizer */}
      <NodeResizer
        color={accentColor}
        isVisible={selected}
        minWidth={130}
        minHeight={80}
        handleStyle={{
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: accentColor,
          border: 'none',
        }}
      />

      {/* Delete Button */}
      {selected && (
        <button
          onClick={handleDeleteClick}
          className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 hover:bg-red-600
                     flex items-center justify-center transition-colors z-10 nodrag
                     shadow-md hover:scale-110"
          title="Delete element"
        >
          <svg viewBox="0 0 10 10" className="w-1.5 h-1.5 text-white">
            <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Element"
        message={`Are you sure you want to delete "${title || displayLabel}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Accent bar */}
      <div
        className="h-px w-full rounded-t"
        style={{ backgroundColor: accentColor }}
      />

      {/* Content */}
      <div className="flex flex-col h-[calc(100%-1px)] px-1.5 py-1">
        {/* Type label */}
        <div className="flex items-center gap-0.5 mb-0.5 flex-shrink-0">
          {isCustomType && data.customTypeIcon ? (
            <DynamicIcon name={data.customTypeIcon} size={6} style={{ color: accentColor }} />
          ) : (
            <ElementIcon type={data.type} size={6} style={{ color: accentColor }} />
          )}
          <span
            className="text-[5px] font-medium uppercase tracking-wide opacity-80"
            style={{ color: accentColor }}
          >
            {displayLabel}
          </span>
        </div>

        {/* Editable Title */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          placeholder={`${displayLabel} title...`}
          style={{ fontFamily }}
          className="
            w-full bg-transparent text-[7px] font-medium text-kwento-text-secondary
            leading-tight mb-1.5 flex-shrink-0
            outline-none focus:outline-none focus-visible:outline-none
            placeholder:text-kwento-text-secondary/40
            border-b border-transparent focus:border-kwento-text-secondary/30
            cursor-text nodrag
          "
        />

        {/* Editable Content */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onMouseDown={handleMouseDown}
          placeholder={`Describe this ${displayLabel.toLowerCase()}...`}
          style={{ fontFamily }}
          className="
            flex-1 w-full resize-none bg-transparent
            text-[6px] text-kwento-text-secondary/70 leading-snug
            placeholder:text-kwento-text-secondary/40
            outline-none focus:outline-none focus-visible:outline-none
            focus:text-kwento-text-secondary
            cursor-text nodrag
          "
        />
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1.5 !h-1.5 !bg-kwento-bg-tertiary !border-0 hover:!bg-kwento-accent transition-colors !rounded-full"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1.5 !h-1.5 !bg-kwento-bg-tertiary !border-0 hover:!bg-kwento-accent transition-colors !rounded-full"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-1.5 !h-1.5 !bg-kwento-bg-tertiary !border-0 hover:!bg-kwento-accent transition-colors !rounded-full"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-1.5 !h-1.5 !bg-kwento-bg-tertiary !border-0 hover:!bg-kwento-accent transition-colors !rounded-full"
      />
    </div>
  )
}

export default memo(StoryNode)
