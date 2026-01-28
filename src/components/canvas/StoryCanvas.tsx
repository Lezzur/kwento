// =============================================================================
// KWENTO - Story Canvas (React Flow Wrapper)
// =============================================================================

'use client'

import { useCallback, useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import StoryNode, { type StoryNodeData } from './nodes/StoryNode'
import CanvasToolbar from './CanvasToolbar'
import { useStore } from '@/store'
import { generateId } from '@/lib/db'
import type { ElementType, Layer } from '@/types'

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

export default function StoryCanvas() {
  const {
    activeLayers,
    toggleLayer,
    zoomLevel,
    setZoom,
  } = useStore()

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            ...defaultEdgeOptions,
            label: 'connects to',
            labelStyle: { fill: '#A8A29E', fontWeight: 500, fontSize: 12 },
            labelBgStyle: { fill: '#292524', fillOpacity: 0.9 },
            labelBgPadding: [4, 8] as [number, number],
            labelBgBorderRadius: 4,
          },
          eds
        )
      )
    },
    [setEdges]
  )

  // Add new element at center of viewport
  const handleAddElement = useCallback(
    (type: ElementType) => {
      const id = generateId()
      const newNode = {
        id,
        type: 'storyNode',
        position: {
          x: 200 + Math.random() * 200,
          y: 100 + Math.random() * 200,
        },
        data: {
          type,
          title: `New ${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}`,
        } as StoryNodeData,
      }
      setNodes((nds) => [...nds, newNode])
    },
    [setNodes]
  )

  // Handle layer toggle
  const handleToggleLayer = useCallback(
    (layer: Layer) => {
      toggleLayer(layer)
    },
    [toggleLayer]
  )

  // Filter nodes by active layers
  const visibleNodes = useMemo(() => {
    if (activeLayers.includes('all')) return nodes

    return nodes.filter((node) => {
      const nodeType = (node.data as StoryNodeData).type
      // Map element types to layers
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
    <div className="w-full h-full bg-kwento-bg-primary">
      <ReactFlow
        nodes={visibleNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: zoomLevel }}
        onMove={(_, viewport) => setZoom(viewport.zoom)}
        proOptions={{ hideAttribution: true }}
        className="kwento-canvas"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="#44403C"
        />
        <Controls
          className="!bg-kwento-bg-secondary !border-kwento-bg-tertiary !rounded-lg !shadow-lg"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-kwento-bg-secondary !border-kwento-bg-tertiary !rounded-lg"
          nodeColor={(node) => {
            const data = node.data as StoryNodeData
            const colorMap: Record<ElementType, string> = {
              scene: '#F59E0B',
              character: '#8B5CF6',
              location: '#10B981',
              'plot-point': '#EF4444',
              idea: '#FACC15',
              chapter: '#3B82F6',
              conflict: '#EC4899',
              theme: '#6366F1',
              note: '#6B7280',
            }
            return colorMap[data.type] || '#6B7280'
          }}
          maskColor="rgba(28, 25, 23, 0.8)"
        />
      </ReactFlow>

      <CanvasToolbar
        onAddElement={handleAddElement}
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
      />
    </div>
  )
}
