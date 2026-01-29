// =============================================================================
// KWENTO - Elements Panel (Canvas Elements + Custom Card Types)
// =============================================================================

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useStore } from '@/store'
import {
  createCustomCardType,
  updateCustomCardType as updateCustomCardTypeDb,
  deleteCustomCardType as deleteCustomCardTypeDb,
} from '@/lib/db'
import { DynamicIcon, ElementIcon, ICON_OPTIONS } from '@/components/icons/StoryIcons'
import type { IconName, CustomCardType, Layer, ElementType, CanvasElement } from '@/types'

// Default colors for the picker
const COLOR_OPTIONS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#6B7280',
]

// Element type labels
const ELEMENT_TYPE_LABELS: Record<ElementType, string> = {
  'scene': 'Scenes',
  'character': 'Characters',
  'location': 'Locations',
  'plot-point': 'Plot Points',
  'idea': 'Ideas',
  'chapter': 'Chapters',
  'conflict': 'Conflicts',
  'theme': 'Themes',
  'note': 'Notes',
}

interface EditingType {
  id: string | null
  name: string
  color: string
  icon: IconName
}

export default function ElementsPanel() {
  const {
    elements,
    customCardTypes,
    activeProjectId,
    addCustomCardType,
    updateCustomCardType,
    removeCustomCardType,
    customPanelCreateMode,
    setCustomPanelCreateMode,
  } = useStore()

  const [isCreating, setIsCreating] = useState(false)
  const [editingType, setEditingType] = useState<EditingType | null>(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())

  // Auto-open create form when triggered from canvas toolbar
  useEffect(() => {
    if (customPanelCreateMode) {
      setEditingType({
        id: null,
        name: '',
        color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
        icon: 'shield',
      })
      setIsCreating(true)
      setCustomPanelCreateMode(false)
    }
  }, [customPanelCreateMode, setCustomPanelCreateMode])

  // Group elements by type
  const groupedElements = useMemo(() => {
    const groups: Record<string, CanvasElement[]> = {}

    elements.forEach((element) => {
      const key = element.customTypeId || element.type
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(element)
    })

    return groups
  }, [elements])

  const toggleSection = (section: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const handleCreate = () => {
    setEditingType({
      id: null,
      name: '',
      color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
      icon: 'shield',
    })
    setIsCreating(true)
  }

  const handleEdit = (type: CustomCardType) => {
    setEditingType({
      id: type.id,
      name: type.name,
      color: type.color,
      icon: type.icon,
    })
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!editingType || !editingType.name.trim() || !activeProjectId) return

    if (editingType.id) {
      await updateCustomCardTypeDb(editingType.id, {
        name: editingType.name.trim(),
        color: editingType.color,
        icon: editingType.icon,
      })
      updateCustomCardType(editingType.id, {
        name: editingType.name.trim(),
        color: editingType.color,
        icon: editingType.icon,
      })
    } else {
      const newType = await createCustomCardType(
        activeProjectId,
        editingType.name.trim(),
        editingType.color,
        editingType.icon,
        'custom' as Layer
      )
      addCustomCardType(newType)
    }

    setEditingType(null)
    setIsCreating(false)
    setShowIconPicker(false)
    setShowColorPicker(false)
  }

  const handleDelete = async (id: string) => {
    await deleteCustomCardTypeDb(id)
    removeCustomCardType(id)
  }

  const handleCancel = () => {
    setEditingType(null)
    setIsCreating(false)
    setShowIconPicker(false)
    setShowColorPicker(false)
  }

  // Render element type section
  const renderElementSection = (type: ElementType, label: string) => {
    const items = groupedElements[type] || []
    if (items.length === 0) return null

    const isCollapsed = collapsedSections.has(type)

    return (
      <div key={type} className="mb-2">
        <button
          onClick={() => toggleSection(type)}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-kwento-text-secondary hover:bg-kwento-bg-tertiary/50 rounded transition-colors"
        >
          <svg
            className={`w-3 h-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <ElementIcon type={type} size={14} />
          <span>{label}</span>
          <span className="ml-auto text-kwento-text-muted">{items.length}</span>
        </button>
        {!isCollapsed && (
          <div className="ml-5 mt-1 space-y-0.5">
            {items.map((element) => (
              <div
                key={element.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-kwento-bg-tertiary/30 text-xs text-kwento-text-primary truncate"
              >
                <span
                  className="w-1 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: element.color }}
                />
                <span className="truncate">{element.title || 'Untitled'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render custom type section
  const renderCustomTypeSection = (customType: CustomCardType) => {
    const items = groupedElements[customType.id] || []
    if (items.length === 0) return null

    const isCollapsed = collapsedSections.has(customType.id)

    return (
      <div key={customType.id} className="mb-2">
        <button
          onClick={() => toggleSection(customType.id)}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-kwento-text-secondary hover:bg-kwento-bg-tertiary/50 rounded transition-colors"
        >
          <svg
            className={`w-3 h-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <DynamicIcon name={customType.icon} size={14} style={{ color: customType.color }} />
          <span>{customType.name}</span>
          <span className="ml-auto text-kwento-text-muted">{items.length}</span>
        </button>
        {!isCollapsed && (
          <div className="ml-5 mt-1 space-y-0.5">
            {items.map((element) => (
              <div
                key={element.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-kwento-bg-tertiary/30 text-xs text-kwento-text-primary truncate"
              >
                <span
                  className="w-1 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: element.color }}
                />
                <span className="truncate">{element.title || 'Untitled'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Elements List */}
      <div className="flex-1 overflow-y-auto p-2">
        {elements.length === 0 ? (
          <div className="text-center py-6 text-kwento-text-muted">
            <p className="text-xs">No elements on canvas yet.</p>
            <p className="text-xs mt-1">Add elements using the toolbar.</p>
          </div>
        ) : (
          <>
            {/* Built-in element types */}
            {Object.entries(ELEMENT_TYPE_LABELS).map(([type, label]) =>
              renderElementSection(type as ElementType, label)
            )}

            {/* Custom element types */}
            {customCardTypes.map((customType) => renderCustomTypeSection(customType))}
          </>
        )}
      </div>

      {/* Custom Types Section */}
      <div className="border-t border-kwento-bg-tertiary">
        <div className="p-2 flex items-center justify-between">
          <h3 className="text-[10px] font-semibold text-kwento-text-secondary uppercase tracking-wide flex items-center gap-1.5">
            <DynamicIcon name="gem" size={10} className="text-kwento-accent" />
            Custom Types
          </h3>
          <button
            onClick={handleCreate}
            disabled={!!editingType}
            className="text-[10px] font-medium text-kwento-accent hover:text-kwento-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + New
          </button>
        </div>

        {/* Editor (when creating or editing) */}
        {editingType && (
          <div className="px-2 pb-2 space-y-2">
            <input
              type="text"
              value={editingType.name}
              onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
              placeholder="Type name..."
              className="w-full px-2 py-1.5 text-xs bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-kwento-text-primary placeholder:text-kwento-text-muted focus:outline-none focus:border-kwento-accent"
              autoFocus
            />

            <div className="flex gap-2">
              {/* Icon Picker */}
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setShowIconPicker(!showIconPicker)
                    setShowColorPicker(false)
                  }}
                  className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-kwento-text-primary hover:border-kwento-accent transition-colors"
                >
                  <DynamicIcon name={editingType.icon} size={12} />
                </button>
                {showIconPicker && (
                  <div className="absolute z-20 bottom-full left-0 right-0 mb-1 p-2 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded shadow-lg max-h-32 overflow-y-auto">
                    <div className="grid grid-cols-5 gap-1">
                      {ICON_OPTIONS.map((opt) => (
                        <button
                          key={opt.name}
                          onClick={() => {
                            setEditingType({ ...editingType, icon: opt.name })
                            setShowIconPicker(false)
                          }}
                          className={`p-1.5 rounded hover:bg-kwento-bg-tertiary transition-colors ${
                            editingType.icon === opt.name ? 'bg-kwento-accent/20 text-kwento-accent' : 'text-kwento-text-primary'
                          }`}
                          title={opt.label}
                        >
                          <DynamicIcon name={opt.name} size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color Picker */}
              <div className="flex-1 relative">
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker)
                    setShowIconPicker(false)
                  }}
                  className="w-full flex items-center justify-center px-2 py-1 text-xs bg-kwento-bg-primary border border-kwento-bg-tertiary rounded hover:border-kwento-accent transition-colors"
                >
                  <span
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: editingType.color }}
                  />
                </button>
                {showColorPicker && (
                  <div className="absolute z-20 bottom-full left-0 right-0 mb-1 p-2 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded shadow-lg">
                    <div className="grid grid-cols-6 gap-1">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setEditingType({ ...editingType, color })
                            setShowColorPicker(false)
                          }}
                          className={`w-5 h-5 rounded transition-transform hover:scale-110 ${
                            editingType.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-kwento-bg-secondary' : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={!editingType.name.trim()}
                className="flex-1 px-2 py-1 text-xs font-medium bg-kwento-accent text-white rounded hover:bg-kwento-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Create' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 text-xs font-medium text-kwento-text-secondary hover:text-kwento-text-primary border border-kwento-bg-tertiary rounded hover:bg-kwento-bg-tertiary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Custom Types List */}
        {!editingType && customCardTypes.length > 0 && (
          <div className="px-2 pb-2 space-y-0.5">
            {customCardTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-kwento-bg-tertiary/50 group"
              >
                <span
                  className="w-1 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: type.color }}
                />
                <DynamicIcon name={type.icon} size={12} style={{ color: type.color }} className="flex-shrink-0" />
                <span className="text-xs text-kwento-text-primary flex-1 truncate">
                  {type.name}
                </span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(type)}
                    className="p-0.5 text-kwento-text-secondary hover:text-kwento-accent transition-colors"
                    title="Edit"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="p-0.5 text-kwento-text-secondary hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
