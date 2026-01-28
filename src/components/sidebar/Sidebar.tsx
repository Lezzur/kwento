// =============================================================================
// KWENTO - Sidebar Component
// =============================================================================

'use client'

import { useStore } from '@/store'
import CharacterPanel from './CharacterPanel'
import PlotHolePanel from './PlotHolePanel'

type SidebarTab = 'elements' | 'characters' | 'plotholes'

const TABS: { id: SidebarTab; label: string; icon: string }[] = [
  { id: 'elements', label: 'Elements', icon: '📦' },
  { id: 'characters', label: 'Characters', icon: '👤' },
  { id: 'plotholes', label: 'Plot Holes', icon: '⚠️' },
]

export default function Sidebar() {
  const { sidebarOpen, sidebarTab, toggleSidebar, setSidebarTab } = useStore()

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-kwento-bg-secondary border border-kwento-bg-tertiary border-l-0 rounded-r-md px-1 py-3 text-kwento-text-secondary hover:text-kwento-text-primary transition-colors"
        title="Open sidebar"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  return (
    <aside className="w-72 flex-shrink-0 border-r border-kwento-bg-tertiary bg-kwento-bg-secondary flex flex-col">
      {/* Tab Bar */}
      <div className="flex border-b border-kwento-bg-tertiary">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className={`flex-1 px-2 py-2 text-[10px] font-medium transition-colors ${
              sidebarTab === tab.id
                ? 'text-kwento-accent border-b-2 border-kwento-accent bg-kwento-bg-tertiary/30'
                : 'text-kwento-text-secondary hover:text-kwento-text-primary'
            }`}
            title={tab.label}
          >
            <span className="block text-sm mb-0.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        <button
          onClick={toggleSidebar}
          className="px-2 text-kwento-text-secondary hover:text-kwento-text-primary transition-colors"
          title="Close sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {sidebarTab === 'characters' && <CharacterPanel />}
        {sidebarTab === 'elements' && (
          <div className="p-3 text-xs text-kwento-text-secondary">
            <p>Elements list coming soon.</p>
            <p className="mt-2">Use the canvas toolbar to add elements.</p>
          </div>
        )}
        {sidebarTab === 'plotholes' && <PlotHolePanel />}
      </div>
    </aside>
  )
}
