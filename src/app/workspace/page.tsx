// =============================================================================
// KWENTO - Workspace Page (Canvas + Chat)
// =============================================================================

'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import ChatPanel from '@/components/chat/ChatPanel'
import Sidebar from '@/components/sidebar/Sidebar'
import { useStore } from '@/store'
import { createProject, getAllProjects, getElementsByProject, getConnectionsByProject, getPlotHolesByProject } from '@/lib/db'

// Dynamic import to avoid SSR issues with React Flow
const StoryCanvas = dynamic(
  () => import('@/components/canvas/StoryCanvas'),
  { ssr: false }
)

export default function WorkspacePage() {
  const { activeProjectId, setActiveProject, setProjects, setElements, setConnections, setPlotHoles } = useStore()

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

  // Load elements, connections, and plot holes when project changes
  useEffect(() => {
    const loadProjectData = async () => {
      if (!activeProjectId) return

      const [elements, connections, plotHoles] = await Promise.all([
        getElementsByProject(activeProjectId),
        getConnectionsByProject(activeProjectId),
        getPlotHolesByProject(activeProjectId),
      ])

      setElements(elements)
      setConnections(connections)
      setPlotHoles(plotHoles)
    }

    loadProjectData()
  }, [activeProjectId, setElements, setConnections, setPlotHoles])

  return (
    <div className="h-full flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <StoryCanvas />
      </div>

      {/* Chat Panel */}
      <ChatPanel />
    </div>
  )
}
