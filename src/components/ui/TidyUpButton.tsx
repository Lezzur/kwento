// =============================================================================
// KWENTO - Tidy Up Button (Auto-Layout)
// =============================================================================

'use client'

import { useCallback } from 'react'
import Dagre from '@dagrejs/dagre'
import { useReactFlow, useNodes, useEdges } from '@xyflow/react'
import { useStore } from '@/store'
import { updateCanvasElement } from '@/lib/db'

// -----------------------------------------------------------------------------
// Tidy Icon
// -----------------------------------------------------------------------------

function TidyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

// -----------------------------------------------------------------------------
// Layout Algorithm
// -----------------------------------------------------------------------------

function getLayoutedNodes(
  nodes: ReturnType<typeof useNodes>,
  edges: ReturnType<typeof useEdges>,
  direction: 'TB' | 'LR' = 'TB'
) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

  g.setGraph({
    rankdir: direction,
    nodesep: 80,    // Horizontal spacing between nodes
    ranksep: 100,   // Vertical spacing between ranks
    marginx: 50,
    marginy: 50,
  })

  // Add nodes to the graph
  nodes.forEach((node) => {
    const width = 180  // Default node width
    const height = 120 // Default node height
    g.setNode(node.id, { width, height })
  })

  // Add edges to the graph
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  // Run the layout
  Dagre.layout(g)

  // Get the new positions
  return nodes.map((node) => {
    const nodeWithPosition = g.node(node.id)
    const width = 180
    const height = 120

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: nodeWithPosition.y - height / 2,
      },
    }
  })
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function TidyUpButton() {
  const { setNodes, fitView } = useReactFlow()
  const nodes = useNodes()
  const edges = useEdges()
  const { updateElement } = useStore()

  const handleTidyUp = useCallback(async () => {
    if (nodes.length === 0) return

    // Get layouted nodes
    const layoutedNodes = getLayoutedNodes(nodes, edges, 'TB')

    // Update React Flow state with animation
    setNodes(layoutedNodes)

    // Save new positions to database and store
    await Promise.all(
      layoutedNodes.map(async (node) => {
        await updateCanvasElement(node.id, { position: node.position })
        updateElement(node.id, { position: node.position })
      })
    )

    // Fit view to show all nodes after layout
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 })
    }, 50)
  }, [nodes, edges, setNodes, fitView, updateElement])

  return (
    <button
      onClick={handleTidyUp}
      className="p-2 rounded-lg transition-colors
        text-kwento-text-secondary hover:text-kwento-accent hover:bg-kwento-bg-tertiary"
      title="Tidy up canvas"
    >
      <TidyIcon className="w-5 h-5" />
    </button>
  )
}
