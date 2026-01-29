// =============================================================================
// KWENTO - Sidebar Component
// =============================================================================

'use client'

import { useState, useRef, useEffect } from 'react'
import { useStore, selectActiveProject } from '@/store'
import { createProject, getAllProjects, updateProject } from '@/lib/db'
import { useToast } from '@/components/ui/Toast'
import CharacterPanel from './CharacterPanel'
import PlotHolePanel from './PlotHolePanel'
import ElementsPanel from './ElementsPanel'
import {
  ElementsIcon,
  CharacterIcon,
  PlotHoleIcon,
} from '@/components/icons/StoryIcons'

type SidebarTab = 'elements' | 'characters' | 'plotholes'

const TABS: { id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string; size?: number }> }[] = [
  { id: 'elements', label: 'Elements', icon: ElementsIcon },
  { id: 'characters', label: 'Characters', icon: CharacterIcon },
  { id: 'plotholes', label: 'Plot Holes', icon: PlotHoleIcon },
]

export default function Sidebar() {
  const { sidebarOpen, sidebarTab, toggleSidebar, setSidebarTab, setActiveProject, setProjects, resetProjectData, updateProject: updateProjectStore } = useStore()
  const activeProject = useStore(selectActiveProject)
  const toast = useToast()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  const handleTitleClick = () => {
    if (activeProject) {
      setEditTitle(activeProject.title)
      setIsEditingTitle(true)
    }
  }

  const handleTitleSave = async () => {
    const trimmedTitle = editTitle.trim()

    if (!trimmedTitle) {
      toast.error('Title cannot be empty')
      setEditTitle(activeProject?.title || 'Untitled Story')
      setIsEditingTitle(false)
      return
    }

    if (activeProject && trimmedTitle !== activeProject.title) {
      try {
        await updateProject(activeProject.id, { title: trimmedTitle })
        updateProjectStore(activeProject.id, { title: trimmedTitle })
        toast.success('Story renamed')
      } catch {
        toast.error('Failed to rename story')
      }
    }
    setIsEditingTitle(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false)
    }
  }

  const handleNewStory = async () => {
    try {
      const newProject = await createProject('Untitled Story')
      const projects = await getAllProjects()
      setProjects(projects)
      resetProjectData()
      setActiveProject(newProject.id)
      toast.success('New story created')
    } catch {
      toast.error('Failed to create story')
    }
  }

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
      {/* Story Header */}
      <div className="px-3 py-2 border-b border-kwento-bg-tertiary flex items-center justify-between gap-2">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            className="text-sm font-semibold text-kwento-text-primary bg-kwento-bg-tertiary/50 border-b border-kwento-text-secondary/30 px-0.5 py-0.5 flex-1 outline-none"
          />
        ) : (
          <h1
            onClick={handleTitleClick}
            className="text-sm font-semibold text-kwento-text-primary truncate flex-1 cursor-pointer hover:text-kwento-accent transition-colors"
            title="Click to rename story"
          >
            {activeProject?.title || 'Untitled Story'}
          </h1>
        )}
        <button
          onClick={handleNewStory}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-kwento-accent hover:bg-kwento-accent/10 rounded transition-colors"
          title="Create new story"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New
        </button>
      </div>

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
            <tab.icon className="mx-auto mb-0.5" size={14} />
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
        {sidebarTab === 'elements' && <ElementsPanel />}
        {sidebarTab === 'plotholes' && <PlotHolePanel />}
      </div>
    </aside>
  )
}
