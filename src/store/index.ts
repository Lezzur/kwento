// =============================================================================
// KWENTO - Zustand Store
// =============================================================================

import { create } from 'zustand'
import type { Project, CanvasElement, Connection, Character, Chapter, Layer, PlotHole } from '@/types'

// -----------------------------------------------------------------------------
// Store Types
// -----------------------------------------------------------------------------

interface UIState {
  // Current view
  currentView: 'dashboard' | 'canvas' | 'writing' | 'chat'

  // Active project
  activeProjectId: string | null

  // Canvas state
  selectedElementIds: string[]
  activeLayers: Layer[]
  zoomLevel: number
  panPosition: { x: number; y: number }

  // Sidebar state
  sidebarOpen: boolean
  sidebarTab: 'elements' | 'characters' | 'plotholes' | 'layers'

  // Chat panel state
  chatPanelOpen: boolean

  // Writing mode
  activeChapterId: string | null
  focusMode: boolean

  // Theme
  theme: 'dark' | 'light'
  mood: 'cozy' | 'professional' | 'playful'
}

interface DataState {
  // Loaded data for active project
  projects: Project[]
  elements: CanvasElement[]
  connections: Connection[]
  characters: Character[]
  chapters: Chapter[]
  plotHoles: PlotHole[]

  // Loading states
  isLoadingProjects: boolean
  isLoadingProject: boolean
  isAnalyzingPlotHoles: boolean
}

interface Actions {
  // UI Actions
  setCurrentView: (view: UIState['currentView']) => void
  setActiveProject: (projectId: string | null) => void
  setSelectedElements: (ids: string[]) => void
  addSelectedElement: (id: string) => void
  removeSelectedElement: (id: string) => void
  clearSelection: () => void
  setActiveLayers: (layers: Layer[]) => void
  toggleLayer: (layer: Layer) => void
  setZoom: (level: number) => void
  setPan: (position: { x: number; y: number }) => void
  toggleSidebar: () => void
  setSidebarTab: (tab: UIState['sidebarTab']) => void
  toggleChatPanel: () => void
  setActiveChapter: (chapterId: string | null) => void
  toggleFocusMode: () => void
  setTheme: (theme: UIState['theme']) => void
  setMood: (mood: UIState['mood']) => void

  // Data Actions
  setProjects: (projects: Project[]) => void
  setElements: (elements: CanvasElement[]) => void
  addElement: (element: CanvasElement) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  removeElement: (id: string) => void
  setConnections: (connections: Connection[]) => void
  addConnection: (connection: Connection) => void
  removeConnection: (id: string) => void
  setCharacters: (characters: Character[]) => void
  setChapters: (chapters: Chapter[]) => void
  setPlotHoles: (plotHoles: PlotHole[]) => void
  addPlotHole: (plotHole: PlotHole) => void
  updatePlotHole: (id: string, updates: Partial<PlotHole>) => void
  removePlotHole: (id: string) => void
  setLoadingProjects: (loading: boolean) => void
  setLoadingProject: (loading: boolean) => void
  setAnalyzingPlotHoles: (analyzing: boolean) => void

  // Reset
  resetProjectData: () => void
}

type KwentoStore = UIState & DataState & Actions

// -----------------------------------------------------------------------------
// Initial State
// -----------------------------------------------------------------------------

const initialUIState: UIState = {
  currentView: 'dashboard',
  activeProjectId: null,
  selectedElementIds: [],
  activeLayers: ['all'],
  zoomLevel: 1,
  panPosition: { x: 0, y: 0 },
  sidebarOpen: true,
  sidebarTab: 'elements',
  chatPanelOpen: true,
  activeChapterId: null,
  focusMode: false,
  theme: 'dark',
  mood: 'cozy',
}

const initialDataState: DataState = {
  projects: [],
  elements: [],
  connections: [],
  characters: [],
  chapters: [],
  plotHoles: [],
  isLoadingProjects: false,
  isLoadingProject: false,
  isAnalyzingPlotHoles: false,
}

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export const useStore = create<KwentoStore>((set) => ({
  // Initial state
  ...initialUIState,
  ...initialDataState,

  // UI Actions
  setCurrentView: (view) => set({ currentView: view }),

  setActiveProject: (projectId) => set({ activeProjectId: projectId }),

  setSelectedElements: (ids) => set({ selectedElementIds: ids }),

  addSelectedElement: (id) =>
    set((state) => ({
      selectedElementIds: state.selectedElementIds.includes(id)
        ? state.selectedElementIds
        : [...state.selectedElementIds, id],
    })),

  removeSelectedElement: (id) =>
    set((state) => ({
      selectedElementIds: state.selectedElementIds.filter((eid) => eid !== id),
    })),

  clearSelection: () => set({ selectedElementIds: [] }),

  setActiveLayers: (layers) => set({ activeLayers: layers }),

  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(layer)
        ? state.activeLayers.filter((l) => l !== layer)
        : [...state.activeLayers, layer],
    })),

  setZoom: (level) => set({ zoomLevel: Math.max(0.1, Math.min(2, level)) }),

  setPan: (position) => set({ panPosition: position }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  toggleChatPanel: () => set((state) => ({ chatPanelOpen: !state.chatPanelOpen })),

  setActiveChapter: (chapterId) => set({ activeChapterId: chapterId }),

  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

  setTheme: (theme) => set({ theme }),

  setMood: (mood) => set({ mood }),

  // Data Actions
  setProjects: (projects) => set({ projects }),

  setElements: (elements) => set({ elements }),

  addElement: (element) =>
    set((state) => ({ elements: [...state.elements, element] })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementIds: state.selectedElementIds.filter((eid) => eid !== id),
    })),

  setConnections: (connections) => set({ connections }),

  addConnection: (connection) =>
    set((state) => ({ connections: [...state.connections, connection] })),

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id),
    })),

  setCharacters: (characters) => set({ characters }),

  setChapters: (chapters) => set({ chapters }),

  setPlotHoles: (plotHoles) => set({ plotHoles }),

  addPlotHole: (plotHole) =>
    set((state) => ({ plotHoles: [...state.plotHoles, plotHole] })),

  updatePlotHole: (id, updates) =>
    set((state) => ({
      plotHoles: state.plotHoles.map((ph) =>
        ph.id === id ? { ...ph, ...updates } : ph
      ),
    })),

  removePlotHole: (id) =>
    set((state) => ({
      plotHoles: state.plotHoles.filter((ph) => ph.id !== id),
    })),

  setLoadingProjects: (loading) => set({ isLoadingProjects: loading }),

  setLoadingProject: (loading) => set({ isLoadingProject: loading }),

  setAnalyzingPlotHoles: (analyzing) => set({ isAnalyzingPlotHoles: analyzing }),

  // Reset project-specific data
  resetProjectData: () =>
    set({
      elements: [],
      connections: [],
      characters: [],
      chapters: [],
      plotHoles: [],
      selectedElementIds: [],
      activeChapterId: null,
    }),
}))

// -----------------------------------------------------------------------------
// Selectors (for convenience)
// -----------------------------------------------------------------------------

export const selectActiveProject = (state: KwentoStore) =>
  state.projects.find((p) => p.id === state.activeProjectId)

export const selectVisibleElements = (state: KwentoStore) =>
  state.elements.filter(
    (el) =>
      state.activeLayers.includes('all') || state.activeLayers.includes(el.layer)
  )

export const selectSelectedElements = (state: KwentoStore) =>
  state.elements.filter((el) => state.selectedElementIds.includes(el.id))

export const selectActiveChapter = (state: KwentoStore) =>
  state.chapters.find((ch) => ch.id === state.activeChapterId)
