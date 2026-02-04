// =============================================================================
// KWENTO - Story Canvas (React Flow Wrapper)
// =============================================================================

'use client'

import { useCallback, useMemo, useRef, useEffect, type KeyboardEvent } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import StoryNode, { type StoryNodeData } from './nodes/StoryNode'
import CanvasToolbar from './CanvasToolbar'
import TidyUpButton from '@/components/ui/TidyUpButton'
import { PenIcon } from '@/components/icons/StoryIcons'
import { useStore } from '@/store'
import { createCanvasElement, deleteCanvasElement, updateCanvasElement, createConnection, deleteConnection } from '@/lib/db'
import { useBatchAutoSave } from '@/hooks/useAutoSave'
import type { ElementType, Layer, CanvasElement, CustomCardType } from '@/types'

// -----------------------------------------------------------------------------
// Convert CanvasElement to React Flow Node
// -----------------------------------------------------------------------------

function elementToNode(element: CanvasElement): Node<StoryNodeData> {
  return {
    id: element.id,
    type: 'storyNode',
    position: element.position,
    data: {
      type: element.type,
      title: element.title,
      content: element.content,
      color: element.color,
    },
  }
}

// -----------------------------------------------------------------------------
// Custom Node Types
// -----------------------------------------------------------------------------

const nodeTypes = {
  storyNode: StoryNode,
}

// -----------------------------------------------------------------------------
// Edge Styles
// -----------------------------------------------------------------------------

const defaultEdgeOptions = {
  style: { stroke: '#F59E0B', strokeWidth: 2 },
  type: 'smoothstep',
  animated: true,
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

function StoryCanvasInner() {
  const {
    activeLayers,
    toggleLayer,
    zoomLevel,
    setZoom,
    setViewportCenter,
    elements,
    activeProjectId,
    addElement,
    removeElement,
    autoSaveEnabled,
    autoSaveInterval,
    customCardTypes,
    openSidebar,
    setSidebarTab,
    setCustomPanelCreateMode,
    setCurrentView,
  } = useStore()

  const containerRef = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<StoryNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Auto-save for node positions (uses interval from settings)
  const { queueSave: queuePositionSave } = useBatchAutoSave<{ x: number; y: number }>(
    useCallback(async (positions) => {
      const updates = Array.from(positions.entries())
      await Promise.all(
        updates.map(([id, position]) => updateCanvasElement(id, { position }))
      )
    }, []),
    autoSaveInterval || 500
  )

  // Custom onNodesChange handler that triggers auto-save for position changes
  const handleNodesChange = useCallback(
    (changes: NodeChange<Node<StoryNodeData>>[]) => {
      onNodesChange(changes)

      // Queue position saves for drag end events (only if auto-save is enabled)
      if (autoSaveEnabled) {
        for (const change of changes) {
          if (change.type === 'position' && change.position && !change.dragging) {
            queuePositionSave(change.id, change.position)
          }
        }
      }
    },
    [onNodesChange, queuePositionSave, autoSaveEnabled]
  )

  // Sync store elements to React Flow nodes (preserve existing positions and dimensions)
  useEffect(() => {
    setNodes((currentNodes) => {
      // Build maps of current positions and dimensions
      const nodeMap = new Map(currentNodes.map((n) => [n.id, n]))

      return elements.map((element) => {
        const existingNode = nodeMap.get(element.id)
        // Look up custom type if this is a custom element
        const customType = element.customTypeId
          ? customCardTypes.find((t) => t.id === element.customTypeId)
          : undefined

        const baseNode = {
          id: element.id,
          type: 'storyNode',
          // Use existing position if available (from dragging), otherwise use stored position
          position: existingNode?.position || element.position,
          // Preserve dimensions if node was resized, otherwise use defaults
          style: existingNode?.style || { width: 180, height: 120 },
          data: {
            type: element.type,
            title: element.title,
            content: element.content,
            color: customType?.color || element.color,
            customTypeId: element.customTypeId,
            customTypeName: customType?.name,
            customTypeIcon: customType?.icon,
          },
        }

        // Preserve all dimension-related properties from existing node
        if (existingNode) {
          return {
            ...baseNode,
            ...(existingNode.width && { width: existingNode.width }),
            ...(existingNode.height && { height: existingNode.height }),
            ...(existingNode.measured && { measured: existingNode.measured }),
          }
        }

        return baseNode
      })
    })
  }, [elements, setNodes, customCardTypes])

  // Handle new connections (with auto-save)
  const onConnect = useCallback(
    async (params: Connection) => {
      if (!activeProjectId || !params.source || !params.target) return

      // Limit: A card can only connect to 2 nodes of another card
      const existingConnectionsCount = edges.filter(
        (e) =>
          (e.source === params.source && e.target === params.target) ||
          (e.source === params.target && e.target === params.source)
      ).length

      if (existingConnectionsCount >= 2) {
        console.warn('Connection limit reached: Cards can only have 2 connections between them')
        return
      }

      // Save to database (no default label - user can add one)
      const connection = await createConnection(
        activeProjectId,
        params.source,
        params.target
      )

      // Update local state with floating label edge
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: connection.id,
            ...defaultEdgeOptions,
            data: { label: '' },
          },
          eds
        )
      )
    },
    [setEdges, activeProjectId, edges]
  )

  // Handle keyboard delete for nodes and edges
  const onKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Don't delete if focus is in a text input
        const target = event.target as HTMLElement
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return

        // Delete selected nodes
        const selectedNodes = nodes.filter((n) => n.selected)
        for (const node of selectedNodes) {
          await deleteCanvasElement(node.id)
          removeElement(node.id)
        }

        // Delete selected edges
        const selectedEdges = edges.filter((e) => e.selected)
        for (const edge of selectedEdges) {
          await deleteConnection(edge.id)
          setEdges((eds) => eds.filter((e) => e.id !== edge.id))
        }
      }
    },
    [nodes, edges, removeElement, setEdges]
  )

  // Add new element at center of viewport
  const handleAddElement = useCallback(
    async (type: ElementType) => {
      if (!activeProjectId) return

      // Get center of viewport in client coordinates
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Convert to flow position (screenToFlowPosition expects client coords)
      const flowCenter = screenToFlowPosition({ x: centerX, y: centerY })

      // Offset by half the card dimensions to center it on the X mark
      // Default card size is 180x120 (from line 149)
      const position = { x: flowCenter.x - 90, y: flowCenter.y - 60 }

      // Map element type to layer
      const layerMap: Record<ElementType, Layer> = {
        character: 'characters',
        scene: 'scenes',
        'plot-point': 'plot',
        location: 'locations',
        theme: 'themes',
        chapter: 'scenes',
        conflict: 'plot',
        idea: 'all',
        note: 'all',
      }

      const element = await createCanvasElement(
        activeProjectId,
        type,
        '',
        position,
        layerMap[type] || 'all'
      )

      addElement(element)
    },
    [activeProjectId, addElement, screenToFlowPosition]
  )

  // Add new custom element at center of viewport
  const handleAddCustomElement = useCallback(
    async (customType: CustomCardType) => {
      if (!activeProjectId) return

      // Get center of viewport in client coordinates
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Convert to flow position (screenToFlowPosition expects client coords)
      const flowCenter = screenToFlowPosition({ x: centerX, y: centerY })

      // Offset by half the card dimensions to center it on the X mark
      // Default card size is 180x120 (from line 149)
      const position = { x: flowCenter.x - 90, y: flowCenter.y - 60 }

      const element = await createCanvasElement(
        activeProjectId,
        'note', // Base type for custom elements
        '',
        position,
        'custom'
      )

      // Update the element with customTypeId
      await updateCanvasElement(element.id, {
        customTypeId: customType.id,
        color: customType.color,
      })

      // Add to store with custom type info
      addElement({
        ...element,
        customTypeId: customType.id,
        color: customType.color,
      })
    },
    [activeProjectId, addElement, screenToFlowPosition]
  )

  // Handle layer toggle
  const handleToggleLayer = useCallback(
    (layer: Layer) => {
      toggleLayer(layer)
    },
    [toggleLayer]
  )

  // Open the Custom panel in the sidebar and trigger create mode
  const handleOpenCustomPanel = useCallback(() => {
    openSidebar()
    setSidebarTab('elements')
    setCustomPanelCreateMode(true)
  }, [openSidebar, setSidebarTab, setCustomPanelCreateMode])

  // Filter nodes by active layers
  const visibleNodes = useMemo(() => {
    if (activeLayers.includes('all')) return nodes

    return nodes.filter((node) => {
      const nodeData = node.data as StoryNodeData
      // Custom elements go to 'custom' layer
      if (nodeData.customTypeId) {
        return activeLayers.includes('custom') || activeLayers.includes('all')
      }

      const nodeType = nodeData.type
      const layerMap: Record<ElementType, Layer> = {
        character: 'characters',
        scene: 'scenes',
        'plot-point': 'plot',
        location: 'locations',
        theme: 'themes',
        chapter: 'scenes',
        conflict: 'plot',
        idea: 'all',
        note: 'all',
      }
      const nodeLayer = layerMap[nodeType]
      return activeLayers.includes(nodeLayer) || activeLayers.includes('all')
    })
  }, [nodes, activeLayers])

  return (
    <div ref={containerRef} className="w-full h-full bg-kwento-bg-primary">
      <ReactFlow
        nodes={visibleNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onKeyDown={onKeyDown}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        onMove={(_, viewport) => {
          setZoom(viewport.zoom)
          // Update viewport center for element spawning from chat
          const container = containerRef.current
          if (container) {
            const rect = container.getBoundingClientRect()
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const flowCenter = screenToFlowPosition({ x: centerX, y: centerY })
            setViewportCenter(flowCenter)
          }
        }}
        proOptions={{ hideAttribution: true }}
        className="kwento-canvas"
        deleteKeyCode={null}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#44403C"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as StoryNodeData
            // Custom elements use their custom type color
            if (data.color) return data.color

            const colorMap: Record<ElementType, string> = {
              scene: '#F59E0B',
              character: '#8B5CF6',
              location: '#10B981',
              'plot-point': '#EF4444',
              idea: '#FACC15',
              chapter: '#3B82F6',
              conflict: '#EC4899',
              theme: '#06B6D4',
              note: '#6B7280',
            }
            return colorMap[data.type] || '#6B7280'
          }}
        />
      </ReactFlow>

      <CanvasToolbar
        onAddElement={handleAddElement}
        onAddCustomElement={handleAddCustomElement}
        onOpenCustomPanel={handleOpenCustomPanel}
        customCardTypes={customCardTypes}
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
      />

      {/* Top-right toolbar buttons */}
      <div className="absolute top-4 right-28 z-10 flex items-center gap-2">
        <button
          onClick={() => setCurrentView('writing')}
          className="bg-kwento-bg-secondary hover:bg-kwento-bg-tertiary border border-kwento-bg-tertiary text-kwento-text-primary p-2 rounded-lg shadow-lg transition-colors"
          title="Switch to Writing Mode"
        >
          <PenIcon size={20} className="text-kwento-text-secondary" />
        </button>
        <TidyUpButton />
      </div>
    </div>
  )
}

export default function StoryCanvas() {
  return (
    <ReactFlowProvider>
      <StoryCanvasInner />
    </ReactFlowProvider>
  )
}
