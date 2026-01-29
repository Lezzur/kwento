// =============================================================================
// KWENTO - Workspace Page (Canvas + Chat)
// =============================================================================

'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import ChatPanel from '@/components/chat/ChatPanel'
import Sidebar from '@/components/sidebar/Sidebar'
import SettingsMenu from '@/components/ui/SettingsMenu'
import ResetButton from '@/components/ui/ResetButton'
import UserMenu from '@/components/ui/UserMenu'
import SyncIndicator from '@/components/ui/SyncIndicator'
import { ToastContainer } from '@/components/ui/Toast'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useStore } from '@/store'
import { createProject, getAllProjects, getElementsByProject, getConnectionsByProject, getPlotHolesByProject, getCustomCardTypesByProject } from '@/lib/db'

// Dynamic imports to avoid SSR issues
const StoryCanvas = dynamic(
  () => import('@/components/canvas/StoryCanvas'),
  { ssr: false }
)

const WritingView = dynamic(
  () => import('@/components/writing/WritingView'),
  { ssr: false }
)

export default function WorkspacePage() {
  const { currentView, setCurrentView, activeProjectId, setActiveProject, setProjects, setElements, setConnections, setPlotHoles, setCustomCardTypes } = useStore()
  const isInitializing = useRef(false)

  // Set view to canvas when workspace page loads
  useEffect(() => {
    if (currentView !== 'canvas' && currentView !== 'writing') {
      setCurrentView('canvas')
    }
  }, [currentView, setCurrentView])

  // Initialize project and load data - consolidated to prevent race conditions
  useEffect(() => {
    const initAndLoadProject = async () => {
      // Prevent concurrent initialization
      if (isInitializing.current) return
      isInitializing.current = true

      try {
        let projectId = activeProjectId

        // If no active project, initialize one
        if (!projectId) {
          const projects = await getAllProjects()
          setProjects(projects)

          if (projects.length > 0) {
            projectId = projects[0].id
          } else {
            const newProject = await createProject('Untitled Story')
            setProjects([newProject])
            projectId = newProject.id
          }
          setActiveProject(projectId)
        }

        // Load project data
        const [elements, connections, plotHoles, customCardTypes] = await Promise.all([
          getElementsByProject(projectId),
          getConnectionsByProject(projectId),
          getPlotHolesByProject(projectId),
          getCustomCardTypesByProject(projectId),
        ])

        setElements(elements)
        setConnections(connections)
        setPlotHoles(plotHoles)
        setCustomCardTypes(customCardTypes)
      } finally {
        isInitializing.current = false
      }
    }

    initAndLoadProject()
  }, [activeProjectId, setActiveProject, setProjects, setElements, setConnections, setPlotHoles, setCustomCardTypes])

  return (
    <ProtectedRoute>
      <div className="h-full flex">
        {/* Left Sidebar - Only show in canvas view */}
        {currentView === 'canvas' && <Sidebar />}

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {currentView === 'canvas' && <StoryCanvas />}
          {currentView === 'writing' && <WritingView />}

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <SyncIndicator />
            {currentView === 'canvas' && <ResetButton />}
            {currentView === 'canvas' && <SettingsMenu />}
            <UserMenu />
          </div>
        </div>

        {/* Chat Panel - Only show in canvas view */}
        {currentView === 'canvas' && <ChatPanel />}

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </ProtectedRoute>
  )
}
