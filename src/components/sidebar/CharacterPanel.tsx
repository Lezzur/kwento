// =============================================================================
// KWENTO - Character Panel Component
// =============================================================================

'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store'
import { getCharactersByProject, createCharacter, updateCharacter, deleteCharacter } from '@/lib/db'
import type { Character, CharacterRole } from '@/types'
import ExpandableTextarea from '@/components/ui/ExpandableTextarea'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'

const ROLE_OPTIONS: { value: CharacterRole; label: string }[] = [
  { value: 'protagonist', label: 'Protagonist' },
  { value: 'antagonist', label: 'Antagonist' },
  { value: 'supporting', label: 'Supporting' },
  { value: 'minor', label: 'Minor' },
]

export default function CharacterPanel() {
  const { activeProjectId, characters, setCharacters } = useStore()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Load characters when project changes
  useEffect(() => {
    const loadCharacters = async () => {
      if (!activeProjectId) return
      const chars = await getCharactersByProject(activeProjectId)
      setCharacters(chars)
    }
    loadCharacters()
  }, [activeProjectId, setCharacters])

  // Handle creating new character
  const handleCreateCharacter = async () => {
    if (!activeProjectId) return
    const char = await createCharacter(activeProjectId, 'New Character', 'supporting')
    setCharacters([...characters, char])
    setSelectedCharacter(char)
    setIsEditing(true)
  }

  // Handle updating character
  const handleUpdateField = async (field: keyof Character, value: unknown) => {
    if (!selectedCharacter) return

    await updateCharacter(selectedCharacter.id, { [field]: value })

    const updated = { ...selectedCharacter, [field]: value }
    setSelectedCharacter(updated)
    setCharacters(characters.map((c) => (c.id === updated.id ? updated : c)))
  }

  return (
    <div className="h-full flex flex-col bg-kwento-bg-secondary">
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-kwento-bg-tertiary">
        <h2 className="text-sm font-medium text-kwento-text-primary">Characters</h2>
        <button
          onClick={handleCreateCharacter}
          className="text-xs px-2 py-1 bg-kwento-accent text-kwento-bg-primary rounded hover:bg-kwento-accent-secondary transition-colors"
        >
          + New
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Character List */}
        <div className="w-1/3 border-r border-kwento-bg-tertiary overflow-y-auto">
          {characters.length === 0 ? (
            <p className="p-3 text-xs text-kwento-text-secondary">No characters yet</p>
          ) : (
            <ul>
              {characters.map((char) => (
                <li key={char.id}>
                  <button
                    onClick={() => {
                      setSelectedCharacter(char)
                      setIsEditing(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs border-b border-kwento-bg-tertiary hover:bg-kwento-bg-tertiary transition-colors ${
                      selectedCharacter?.id === char.id ? 'bg-kwento-bg-tertiary' : ''
                    }`}
                  >
                    <span className="block font-medium text-kwento-text-primary truncate">
                      {char.name}
                    </span>
                    <span className="text-[10px] text-kwento-text-secondary capitalize">
                      {char.role}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Character Detail */}
        <div className="flex-1 overflow-y-auto p-3">
          {selectedCharacter ? (
            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={selectedCharacter.name}
                  onChange={(e) => handleUpdateField('name', e.target.value)}
                  className="w-full px-2 py-1.5 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-xs text-kwento-text-primary focus:outline-none focus:ring-1 focus:ring-kwento-accent"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Role
                </label>
                <select
                  value={selectedCharacter.role}
                  onChange={(e) => handleUpdateField('role', e.target.value)}
                  className="w-full px-2 py-1.5 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-xs text-kwento-text-primary focus:outline-none focus:ring-1 focus:ring-kwento-accent"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Physical Description */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Appearance
                </label>
                <ExpandableTextarea
                  value={selectedCharacter.physicalDescription || ''}
                  onChange={(val) => handleUpdateField('physicalDescription', val)}
                  placeholder="What do they look like?"
                  label="Appearance"
                  rows={2}
                />
              </div>

              {/* Personality */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Personality Traits
                </label>
                <input
                  type="text"
                  value={selectedCharacter.personality?.join(', ') || ''}
                  onChange={(e) =>
                    handleUpdateField(
                      'personality',
                      e.target.value
                        .split(/[\s,.\-;|]+/)
                        .map((s) => s.trim())
                        .filter(Boolean)
                    )
                  }
                  placeholder="brave stubborn loyal"
                  className="w-full px-2 py-1.5 bg-kwento-bg-primary border border-kwento-bg-tertiary rounded text-xs text-kwento-text-primary placeholder:text-kwento-text-secondary focus:outline-none focus:ring-1 focus:ring-kwento-accent"
                />
              </div>

              {/* Goals */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Goals & Motivations
                </label>
                <ExpandableTextarea
                  value={selectedCharacter.goals || ''}
                  onChange={(val) => handleUpdateField('goals', val)}
                  placeholder="What do they want? Why?"
                  label="Goals & Motivations"
                  rows={2}
                />
              </div>

              {/* Backstory */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Backstory
                </label>
                <ExpandableTextarea
                  value={selectedCharacter.backstory || ''}
                  onChange={(val) => handleUpdateField('backstory', val)}
                  placeholder="History before the story begins..."
                  label="Backstory"
                  rows={3}
                />
              </div>

              {/* Character Arc */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Character Arc
                </label>
                <ExpandableTextarea
                  value={selectedCharacter.arc || ''}
                  onChange={(val) => handleUpdateField('arc', val)}
                  placeholder="How do they change through the story?"
                  label="Character Arc"
                  rows={2}
                />
              </div>

              {/* Voice Notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Voice / Speech Patterns
                </label>
                <ExpandableTextarea
                  value={selectedCharacter.voiceNotes || ''}
                  onChange={(val) => handleUpdateField('voiceNotes', val)}
                  placeholder="How do they talk? Accent, catchphrases..."
                  label="Voice / Speech Patterns"
                  rows={2}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-kwento-text-secondary mb-1">
                  Notes
                </label>
                <ExpandableTextarea
                  value={selectedCharacter.notes || ''}
                  onChange={(val) => handleUpdateField('notes', val)}
                  placeholder="Additional notes..."
                  label="Notes"
                  rows={2}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-kwento-text-secondary">
              Select a character to view details
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
