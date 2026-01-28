// =============================================================================
// KWENTO - Plot Hole Detection Service
// =============================================================================

import type { CanvasElement, Connection, Character, PlotHole, PlotHoleSeverity } from '@/types'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface DetectionContext {
  elements: CanvasElement[]
  connections: Connection[]
  characters: Character[]
  projectId: string
}

interface DetectedIssue {
  description: string
  severity: PlotHoleSeverity
  relatedElements: string[]
  aiSuggestion?: string
}

// -----------------------------------------------------------------------------
// Rule-Based Detection
// -----------------------------------------------------------------------------

/**
 * Detect orphaned elements (no connections)
 */
function detectOrphanedElements(ctx: DetectionContext): DetectedIssue[] {
  const issues: DetectedIssue[] = []
  const connectedIds = new Set<string>()

  ctx.connections.forEach((conn) => {
    connectedIds.add(conn.sourceId)
    connectedIds.add(conn.targetId)
  })

  // Only flag story-critical elements as orphans
  const criticalTypes = ['scene', 'plot-point', 'conflict', 'chapter']

  ctx.elements
    .filter((el) => criticalTypes.includes(el.type) && !connectedIds.has(el.id))
    .forEach((el) => {
      issues.push({
        description: `"${el.title}" is not connected to any other story element. Is it part of the main narrative?`,
        severity: 'minor',
        relatedElements: [el.id],
        aiSuggestion: `Consider connecting "${el.title}" to related scenes or characters to show how it fits into your story.`,
      })
    })

  return issues
}

/**
 * Detect characters without scenes
 */
function detectUnusedCharacters(ctx: DetectionContext): DetectedIssue[] {
  const issues: DetectedIssue[] = []

  // Get character elements on canvas
  const characterElements = ctx.elements.filter((el) => el.type === 'character')

  // Get all connections involving characters
  const characterConnections = ctx.connections.filter((conn) =>
    characterElements.some((c) => c.id === conn.sourceId || c.id === conn.targetId)
  )

  // Find characters with no scene connections
  characterElements.forEach((charEl) => {
    const hasSceneConnection = characterConnections.some((conn) => {
      const otherId = conn.sourceId === charEl.id ? conn.targetId : conn.sourceId
      const otherEl = ctx.elements.find((el) => el.id === otherId)
      return otherEl?.type === 'scene'
    })

    if (!hasSceneConnection) {
      issues.push({
        description: `"${charEl.title}" hasn't appeared in any scenes yet. When do they enter the story?`,
        severity: 'minor',
        relatedElements: [charEl.id],
        aiSuggestion: `Connect "${charEl.title}" to at least one scene to establish their role in the narrative.`,
      })
    }
  })

  return issues
}

/**
 * Detect scenes without characters
 */
function detectEmptyScenes(ctx: DetectionContext): DetectedIssue[] {
  const issues: DetectedIssue[] = []

  const sceneElements = ctx.elements.filter((el) => el.type === 'scene')
  const characterElements = ctx.elements.filter((el) => el.type === 'character')

  sceneElements.forEach((scene) => {
    const hasCharacter = ctx.connections.some((conn) => {
      const otherId = conn.sourceId === scene.id ? conn.targetId : conn.sourceId
      return characterElements.some((c) => c.id === otherId)
    })

    if (!hasCharacter) {
      issues.push({
        description: `"${scene.title}" has no characters involved. Who's in this scene?`,
        severity: 'moderate',
        relatedElements: [scene.id],
        aiSuggestion: `Every scene needs characters. Consider which characters should be present in "${scene.title}".`,
      })
    }
  })

  return issues
}

/**
 * Detect conflicts without resolution
 */
function detectUnresolvedConflicts(ctx: DetectionContext): DetectedIssue[] {
  const issues: DetectedIssue[] = []

  const conflictElements = ctx.elements.filter((el) => el.type === 'conflict')

  conflictElements.forEach((conflict) => {
    // Check for "resolves" or "leads to" connections
    const hasResolution = ctx.connections.some((conn) => {
      if (conn.sourceId !== conflict.id) return false
      const label = conn.label?.toLowerCase() || ''
      return label.includes('resolv') || label.includes('leads to') || label.includes('ends')
    })

    if (!hasResolution) {
      issues.push({
        description: `"${conflict.title}" doesn't appear to have a resolution. How does this conflict end?`,
        severity: 'moderate',
        relatedElements: [conflict.id],
        aiSuggestion: `Consider how "${conflict.title}" gets resolved. Add a connection to the scene or event where it's addressed.`,
      })
    }
  })

  return issues
}

/**
 * Detect plot points with no setup (foreshadowing)
 */
function detectUnsetupPlotPoints(ctx: DetectionContext): DetectedIssue[] {
  const issues: DetectedIssue[] = []

  const plotPoints = ctx.elements.filter((el) => el.type === 'plot-point')

  plotPoints.forEach((point) => {
    // Check for incoming connections (something leading to this)
    const hasSetup = ctx.connections.some(
      (conn) => conn.targetId === point.id
    )

    if (!hasSetup) {
      issues.push({
        description: `"${point.title}" appears without any buildup. What leads to this moment?`,
        severity: 'minor',
        relatedElements: [point.id],
        aiSuggestion: `Major plot points work better with setup. Consider what scenes or events foreshadow "${point.title}".`,
      })
    }
  })

  return issues
}

/**
 * Detect potential timeline issues (basic heuristic)
 */
function detectTimelineIssues(ctx: DetectionContext): DetectedIssue[] {
  const issues: DetectedIssue[] = []

  // Check for circular connections that might indicate timeline confusion
  const graph = new Map<string, string[]>()

  ctx.connections.forEach((conn) => {
    if (!graph.has(conn.sourceId)) {
      graph.set(conn.sourceId, [])
    }
    graph.get(conn.sourceId)!.push(conn.targetId)
  })

  // Simple cycle detection using DFS
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const cycleNodes: string[] = []

  function hasCycle(nodeId: string): boolean {
    visited.add(nodeId)
    recursionStack.add(nodeId)

    const neighbors = graph.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) {
          cycleNodes.push(nodeId)
          return true
        }
      } else if (recursionStack.has(neighbor)) {
        cycleNodes.push(nodeId, neighbor)
        return true
      }
    }

    recursionStack.delete(nodeId)
    return false
  }

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId) && hasCycle(nodeId)) {
      const uniqueNodes = [...new Set(cycleNodes)]
      const nodeNames = uniqueNodes
        .map((id) => ctx.elements.find((el) => el.id === id)?.title)
        .filter(Boolean)

      if (nodeNames.length > 0) {
        issues.push({
          description: `Circular connection detected between: ${nodeNames.join(' → ')}. Is this intentional?`,
          severity: 'moderate',
          relatedElements: uniqueNodes,
          aiSuggestion: `Circular story structures can work (like frame narratives), but make sure this loop is intentional and clear to readers.`,
        })
      }
      break // Only report one cycle
    }
  }

  return issues
}

// -----------------------------------------------------------------------------
// Main Detection Function
// -----------------------------------------------------------------------------

/**
 * Run all plot hole detection rules
 */
export function detectPlotHoles(ctx: DetectionContext): DetectedIssue[] {
  const allIssues: DetectedIssue[] = []

  // Only run detection if there's enough story content
  if (ctx.elements.length < 2) {
    return []
  }

  allIssues.push(...detectOrphanedElements(ctx))
  allIssues.push(...detectUnusedCharacters(ctx))
  allIssues.push(...detectEmptyScenes(ctx))
  allIssues.push(...detectUnresolvedConflicts(ctx))
  allIssues.push(...detectUnsetupPlotPoints(ctx))
  allIssues.push(...detectTimelineIssues(ctx))

  return allIssues
}

/**
 * Convert detected issues to PlotHole objects (without saving)
 */
export function issuesToPlotHoles(
  issues: DetectedIssue[],
  projectId: string,
  existingHoles: PlotHole[]
): Omit<PlotHole, 'id' | 'createdAt'>[] {
  // Filter out issues that match existing open plot holes
  const existingDescriptions = new Set(
    existingHoles
      .filter((h) => h.status === 'open')
      .map((h) => h.description)
  )

  return issues
    .filter((issue) => !existingDescriptions.has(issue.description))
    .map((issue) => ({
      projectId,
      description: issue.description,
      severity: issue.severity,
      relatedElements: issue.relatedElements,
      status: 'open' as const,
      aiSuggestion: issue.aiSuggestion,
    }))
}
