// =============================================================================
// KWENTO - Settings Menu
// =============================================================================

'use client'

import { useState, useEffect, useRef } from 'react'
import { useStore, type CardFont, type AutoSaveInterval } from '@/store'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Theme = 'dark' | 'midnight' | 'light'

// Theme options
const themeOptions: { theme: Theme; label: string; colors: string[] }[] = [
  { theme: 'midnight', label: 'Midnight', colors: ['#0A0A0A', '#141414', '#1F1F1F'] },
  { theme: 'dark', label: 'Dark', colors: ['#1C1917', '#292524', '#44403C'] },
  { theme: 'light', label: 'Light', colors: ['#FAFAF9', '#F5F5F4', '#E7E5E4'] },
]

// Font options
const fontOptions: { font: CardFont; label: string }[] = [
  { font: 'system', label: 'System' },
  { font: 'serif', label: 'Serif' },
  { font: 'mono', label: 'Mono' },
  { font: 'handwritten', label: 'Handwritten' },
]

// Auto-save interval options
const autoSaveIntervalOptions: { value: AutoSaveInterval; label: string }[] = [
  { value: 500, label: '0.5s' },
  { value: 1000, label: '1s' },
  { value: 2000, label: '2s' },
  { value: 5000, label: '5s' },
]

// Font family CSS mapping
const fontFamilyMap: Record<CardFont, string> = {
  system: 'Inter, system-ui, sans-serif',
  serif: 'Georgia, Cambria, serif',
  mono: 'ui-monospace, monospace',
  handwritten: 'var(--font-caveat), Caveat, cursive',
}

// -----------------------------------------------------------------------------
// Gear Icon
// -----------------------------------------------------------------------------

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const theme = useStore((state) => state.theme)
  const setTheme = useStore((state) => state.setTheme)
  const cardFont = useStore((state) => state.cardFont)
  const setCardFont = useStore((state) => state.setCardFont)
  const autoSaveEnabled = useStore((state) => state.autoSaveEnabled)
  const setAutoSaveEnabled = useStore((state) => state.setAutoSaveEnabled)
  const autoSaveInterval = useStore((state) => state.autoSaveInterval)
  const setAutoSaveInterval = useStore((state) => state.setAutoSaveInterval)

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2 rounded-lg transition-colors
          ${isOpen
            ? 'bg-kwento-bg-tertiary text-kwento-text-primary'
            : 'text-kwento-text-secondary hover:text-kwento-text-primary hover:bg-kwento-bg-tertiary'
          }
        `}
        title="Settings"
      >
        <GearIcon className="w-5 h-5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-kwento-bg-secondary rounded-lg border border-kwento-bg-tertiary shadow-xl z-50">
          <div className="p-4 space-y-4">
            {/* Theme Section */}
            <div>
              <h3 className="text-xs font-semibold text-kwento-text-secondary uppercase tracking-wide mb-2">
                Theme
              </h3>
              <div className="flex gap-2">
                {themeOptions.map((option) => {
                  const isActive = theme === option.theme
                  return (
                    <button
                      key={option.theme}
                      onClick={() => setTheme(option.theme)}
                      className={`
                        flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors flex-1
                        ${isActive
                          ? 'bg-kwento-bg-tertiary ring-2 ring-kwento-accent'
                          : 'hover:bg-kwento-bg-tertiary'
                        }
                      `}
                      title={option.label}
                    >
                      <div className="flex rounded overflow-hidden border border-kwento-bg-tertiary">
                        {option.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-5"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-kwento-text-secondary">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-kwento-bg-tertiary" />

            {/* Font Section */}
            <div>
              <h3 className="text-xs font-semibold text-kwento-text-secondary uppercase tracking-wide mb-2">
                Card Font
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {fontOptions.map((option) => {
                  const isActive = cardFont === option.font
                  return (
                    <button
                      key={option.font}
                      onClick={() => setCardFont(option.font)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left
                        ${isActive
                          ? 'bg-kwento-accent text-kwento-bg-primary'
                          : 'text-kwento-text-secondary hover:bg-kwento-bg-tertiary'
                        }
                      `}
                    >
                      <span
                        className="text-base font-medium"
                        style={{ fontFamily: fontFamilyMap[option.font] }}
                      >
                        Aa
                      </span>
                      <span className="text-xs">{option.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-kwento-bg-tertiary" />

            {/* Auto-Save Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-kwento-text-secondary uppercase tracking-wide">
                  Auto Save
                </h3>
                <button
                  onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                  className={`
                    relative w-10 h-5 rounded-full transition-colors
                    ${autoSaveEnabled ? 'bg-kwento-accent' : 'bg-kwento-bg-tertiary'}
                  `}
                >
                  <span
                    className={`
                      absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                      ${autoSaveEnabled ? 'left-5' : 'left-0.5'}
                    `}
                  />
                </button>
              </div>

              {autoSaveEnabled && (
                <div>
                  <span className="text-[10px] text-kwento-text-secondary block mb-1.5">
                    Save interval
                  </span>
                  <div className="flex gap-1">
                    {autoSaveIntervalOptions.map((option) => {
                      const isActive = autoSaveInterval === option.value
                      return (
                        <button
                          key={option.value}
                          onClick={() => setAutoSaveInterval(option.value)}
                          className={`
                            flex-1 px-2 py-1.5 rounded text-xs transition-colors
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
