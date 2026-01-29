// =============================================================================
// KWENTO - Workspace Layout
// =============================================================================

'use client'

import type { ReactNode } from 'react'
import { useStore, selectActiveProject } from '@/store'
import { EditableTitle } from '@/components/ui/EditableTitle'

interface WorkspaceLayoutProps {
  children: ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const activeProject = useStore(selectActiveProject)
  const updateProject = useStore((state) => state.updateProject)

  const handleTitleChange = (newTitle: string) => {
    if (activeProject) {
      updateProject(activeProject.id, { title: newTitle })
    }
  }

  return (
    <div className="h-screen flex flex-col bg-kwento-bg-primary">
      {/* Header */}
      <header className="h-14 flex-shrink-0 flex items-center justify-between px-4 border-b border-kwento-bg-tertiary bg-kwento-bg-secondary">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-kwento-accent">Kwento</h1>
          <EditableTitle
            value={activeProject?.title || ''}
            onSave={handleTitleChange}
            placeholder="Untitled Project"
            className="text-sm text-kwento-text-secondary"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-kwento-text-secondary hover:text-kwento-text-primary transition-colors">
            Export
          </button>
          <button className="px-3 py-1.5 text-sm bg-kwento-accent text-kwento-bg-primary rounded-md hover:bg-kwento-accent-secondary transition-colors">
            Save
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
