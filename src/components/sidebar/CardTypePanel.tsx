// =============================================================================
// KWENTO - Card Type Panel (Custom Card Types Management)
// =============================================================================

'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store'
import {
  createCustomCardType,
  updateCustomCardType as updateCustomCardTypeDb,
  deleteCustomCardType as deleteCustomCardTypeDb,
} from '@/lib/db'
import { DynamicIcon, ICON_OPTIONS } from '@/components/icons/StoryIcons'
import type { IconName, CustomCardType, Layer } from '@/types'

// Default colors for the picker
const COLOR_OPTIONS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#EAB308', // yellow
  '#84CC16', // lime
  '#22C55E', // green
  '#10B981', // emerald
  '#14B8A6', // teal
  '#06B6D4', // cyan
  '#0EA5E9', // sky
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A855F7', // purple
  '#D946EF', // fuchsia
  '#EC4899', // pink
  '#F43F5E', // rose
  '#6B7280', // gray
]

interface EditingType {
  id: string | null // null for new
  name: string
  color: string
  icon: IconName
}

export default function CardTypePanel() {
  const { customCardTypes, activeProjectId, addCustomCardType, updateCustomCardType, removeCustomCardType, customPanelCreateMode, setCustomPanelCreateMode } = useStore()

  const [isCreating, setIsCreating] = useState(false)
  const [editingType, setEditingType] = useState<EditingType | null>(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

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
      // Update existing
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
      // Create new
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

  return (
    <div className="flex flex-col h-full">
      {/* + New Button */}
      <div className="p-3 border-b border-kwento-bg-tertiary flex justify-end">
        <button
          onClick={handleCreate}
          disabled={!!editingType}
          className="text-xs font-medium text-kwento-accent hover:text-kwento-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + New
        </button>
      </div>

      {/* Editor (when creating or editing) */}
      {editingType && (
        <div className="p-3 border-b border-kwento-bg-tertiary bg-kwento-bg-tertiary/30 space-y-3">
          {/* Name Input */}
          <div>
            <label className="block text-[10px] font-medium text-kwento-text-secondary uppercase mb-1">
              Name
            </label>
            <input
              type="text"
              value={editingType.name}
              onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
              placeholder="e.g. Organization, Artifact, Species..."
              className="w-full px-2 py-1.5 text-xs bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-kwento-text-primary placeholder:text-kwento-text-muted focus:outline-none focus:border-kwento-accent"
              autoFocus
            />
          </div>

          {/* Icon & Color Row */}
          <div className="flex gap-3">
            {/* Icon Picker */}
            <div className="flex-1 relative">
              <label className="block text-[10px] font-medium text-kwento-text-secondary uppercase mb-1">
                Icon
              </label>
              <button
                onClick={() => {
                  setShowIconPicker(!showIconPicker)
                  setShowColorPicker(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-2 py-1.5 text-xs bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-kwento-text-primary hover:border-kwento-accent transition-colors"
              >
                <DynamicIcon name={editingType.icon} size={14} />
                <span className="capitalize">{editingType.icon}</span>
              </button>
              {showIconPicker && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 p-2 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded shadow-lg max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-1">
                    {ICON_OPTIONS.map((opt) => (
                      <button
                        key={opt.name}
                        onClick={() => {
                          setEditingType({ ...editingType, icon: opt.name })
                          setShowIconPicker(false)
                        }}
                        className={`p-2 rounded hover:bg-kwento-bg-tertiary transition-colors ${
                          editingType.icon === opt.name ? 'bg-kwento-accent/20 text-kwento-accent' : 'text-kwento-text-primary'
                        }`}
                        title={opt.label}
                      >
                        <DynamicIcon name={opt.name} size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Picker */}
            <div className="flex-1 relative">
              <label className="block text-[10px] font-medium text-kwento-text-secondary uppercase mb-1">
                Color
              </label>
              <button
                onClick={() => {
                  setShowColorPicker(!showColorPicker)
                  setShowIconPicker(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-2 py-1.5 text-xs bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-kwento-text-primary hover:border-kwento-accent transition-colors"
              >
                <span
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: editingType.color }}
                />
                <span className="font-mono text-[10px]">{editingType.color}</span>
              </button>
              {showColorPicker && (
                <div className="absolute z-20 top-full left-0 right-0 mt-1 p-2 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded shadow-lg">
                  <div className="grid grid-cols-6 gap-1">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setEditingType({ ...editingType, color })
                          setShowColorPicker(false)
                        }}
                        className={`w-6 h-6 rounded transition-transform hover:scale-110 ${
                          editingType.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-kwento-bg-secondary' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-[10px] font-medium text-kwento-text-secondary uppercase mb-1">
              Preview
            </label>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded">
              <span
                className="w-1 h-6 rounded-full"
                style={{ backgroundColor: editingType.color }}
              />
              <DynamicIcon name={editingType.icon} size={14} style={{ color: editingType.color }} />
              <span className="text-xs font-medium text-kwento-text-primary uppercase">
                {editingType.name || 'Type Name'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!editingType.name.trim()}
              className="flex-1 px-3 py-1.5 text-xs font-medium bg-kwento-accent text-white rounded hover:bg-kwento-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Create' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium text-kwento-text-secondary hover:text-kwento-text-primary border border-kwento-bg-tertiary rounded hover:bg-kwento-bg-tertiary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Card Types List */}
      <div className="flex-1 overflow-y-auto p-2">
        {customCardTypes.length === 0 && !editingType ? (
          <div className="text-center py-8 text-kwento-text-muted">
            <p className="text-xs">No custom card types yet.</p>
            <p className="text-xs mt-1">Create one to use on your canvas.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {customCardTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-kwento-bg-tertiary/50 group"
              >
                <span
                  className="w-1 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: type.color }}
                />
                <DynamicIcon name={type.icon} size={14} style={{ color: type.color }} className="flex-shrink-0" />
                <span className="text-xs font-medium text-kwento-text-primary flex-1 truncate">
                  {type.name}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(type)}
                    className="p-1 text-kwento-text-secondary hover:text-kwento-accent transition-colors"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="p-1 text-kwento-text-secondary hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
