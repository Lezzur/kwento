// =============================================================================
// KWENTO - Workspace Page (Canvas + Chat)
// =============================================================================

'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import ChatPanel from '@/components/chat/ChatPanel'
import { useStore } from '@/store'
import { createProject, getAllProjects } from '@/lib/db'

// Dynamic import to avoid SSR issues with React Flow
const StoryCanvas = dynamic(
  () => import('@/components/canvas/StoryCanvas'),
  { ssr: false }
)

export default function WorkspacePage() {
  const { activeProjectId, setActiveProject, setProjects } = useStore()

  // Initialize or load project on mount
  useEffect(() => {
    const initProject = async () => {
      const projects = await getAllProjects()
      setProjects(projects)

      if (projects.length > 0) {
        // Use most recently updated project
        setActiveProject(projects[0].id)
      } else {
        // Create a new project
        const newProject = await createProject('Untitled Story')
        setProjects([newProject])
        setActiveProject(newProject.id)
      }
    }

    if (!activeProjectId) {
      initProject()
    }
  }, [activeProjectId, setActiveProject, setProjects])

  return (
    <div className="h-full flex">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <StoryCanvas />
      </div>

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  )
}
