// =============================================================================
// KWENTO - Sidebar Component
// =============================================================================

'use client'

import { useState, useRef, useEffect } from 'react'
import { useStore, selectActiveProject } from '@/store'
import { createProject, getAllProjects, updateProject, deleteProject } from '@/lib/db'
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
  const { sidebarOpen, sidebarTab, toggleSidebar, setSidebarTab, setActiveProject, setProjects, resetProjectData, updateProject: updateProjectStore, projects } = useStore()
  const activeProject = useStore(selectActiveProject)
  const toast = useToast()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropdownOpen])

  const handleTitleDoubleClick = () => {
    if (activeProject) {
      setEditTitle(activeProject.title)
      setIsEditingTitle(true)
      setIsDropdownOpen(false)
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
      const updatedProjects = await getAllProjects()
      setProjects(updatedProjects)
      resetProjectData()
      setActiveProject(newProject.id)
      setIsDropdownOpen(false)
      toast.success('New story created')
    } catch {
      toast.error('Failed to create story')
    }
  }

  const handleSwitchStory = (projectId: string) => {
    if (projectId !== activeProject?.id) {
      resetProjectData()
      setActiveProject(projectId)
      toast.success('Switched story')
    }
    setIsDropdownOpen(false)
  }

  const handleDeleteStory = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (projects.length <= 1) {
      toast.error('Cannot delete the only story')
      return
    }

    try {
      await deleteProject(projectId)
      const updatedProjects = await getAllProjects()
      setProjects(updatedProjects)

      // If deleting active project, switch to another
      if (projectId === activeProject?.id && updatedProjects.length > 0) {
        resetProjectData()
        setActiveProject(updatedProjects[0].id)
      }

      toast.success('Story deleted')
    } catch {
      toast.error('Failed to delete story')
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
      {/* Story Header with Dropdown */}
      <div className="px-3 py-2 border-b border-kwento-bg-tertiary relative" ref={dropdownRef}>
        <div className="flex items-center justify-between gap-2">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="text-sm font-semibold text-kwento-text-primary bg-kwento-bg-tertiary/50 rounded px-1 py-0.5 flex-1 outline-none focus-visible:outline-none"
            />
          ) : (
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onDoubleClick={handleTitleDoubleClick}
              className="flex items-center gap-1 flex-1 min-w-0 group"
              title="Click to browse stories, double-click to rename"
            >
              <h1 className="text-sm font-semibold text-kwento-text-secondary truncate group-hover:text-kwento-accent transition-colors">
                {activeProject?.title || 'Untitled Story'}
              </h1>
              <svg
                className={`w-3.5 h-3.5 text-kwento-text-secondary flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
          <button
            onClick={handleNewStory}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-kwento-accent hover:bg-kwento-accent/10 rounded transition-colors flex-shrink-0"
            title="Create new story"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        </div>

        {/* Story Dropdown */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 mx-2 bg-kwento-bg-tertiary border border-kwento-bg-tertiary rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {projects.length === 0 ? (
              <div className="px-3 py-2 text-xs text-kwento-text-secondary">No stories yet</div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleSwitchStory(project.id)}
                  className={`flex items-center justify-between gap-2 px-3 py-2 cursor-pointer transition-colors group ${
                    project.id === activeProject?.id
                      ? 'bg-kwento-accent/10 text-kwento-accent'
                      : 'hover:bg-kwento-bg-secondary text-kwento-text-secondary hover:text-kwento-text-primary'
                  }`}
                >
                  <span className="text-sm truncate flex-1">{project.title}</span>
                  {project.id !== activeProject?.id && (
                    <button
                      onClick={(e) => handleDeleteStory(project.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                      title="Delete story"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
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
