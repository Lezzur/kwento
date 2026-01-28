// =============================================================================
// KWENTO - Plot Hole Panel Component
// =============================================================================

'use client'

import { useCallback, useEffect } from 'react'
import { useStore } from '@/store'
import {
  getPlotHolesByProject,
  createPlotHole,
  updatePlotHole as updatePlotHoleDb,
  deletePlotHole as deletePlotHoleDb,
} from '@/lib/db'
import { detectPlotHoles, issuesToPlotHoles } from '@/lib/plotHoleDetector'
import type { PlotHole, PlotHoleSeverity, PlotHoleStatus } from '@/types'

// -----------------------------------------------------------------------------
// Severity Badge
// -----------------------------------------------------------------------------

function SeverityBadge({ severity }: { severity: PlotHoleSeverity }) {
  const styles: Record<PlotHoleSeverity, string> = {
    minor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    moderate: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    major: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <span className={`text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded border ${styles[severity]}`}>
      {severity}
    </span>
  )
}

// -----------------------------------------------------------------------------
// Status Badge
// -----------------------------------------------------------------------------

function StatusBadge({ status }: { status: PlotHoleStatus }) {
  const styles: Record<PlotHoleStatus, string> = {
    open: 'bg-blue-500/20 text-blue-400',
    resolved: 'bg-green-500/20 text-green-400',
    ignored: 'bg-gray-500/20 text-gray-400',
  }

  return (
    <span className={`text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded ${styles[status]}`}>
      {status}
    </span>
  )
}

// -----------------------------------------------------------------------------
// Plot Hole Card
// -----------------------------------------------------------------------------

interface PlotHoleCardProps {
  plotHole: PlotHole
  onStatusChange: (id: string, status: PlotHoleStatus) => void
  onDelete: (id: string) => void
}

function PlotHoleCard({ plotHole, onStatusChange, onDelete }: PlotHoleCardProps) {
  const isOpen = plotHole.status === 'open'

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        isOpen
          ? 'bg-kwento-bg-tertiary/50 border-kwento-bg-tertiary'
          : 'bg-kwento-bg-secondary/50 border-kwento-bg-tertiary/50 opacity-60'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <SeverityBadge severity={plotHole.severity} />
        <StatusBadge status={plotHole.status} />
      </div>

      {/* Description */}
      <p className="text-xs text-kwento-text-primary leading-relaxed mb-2">
        {plotHole.description}
      </p>

      {/* AI Suggestion */}
      {plotHole.aiSuggestion && isOpen && (
        <div className="bg-kwento-accent/10 border border-kwento-accent/20 rounded p-2 mb-2">
          <p className="text-[10px] text-kwento-accent leading-relaxed">
            <span className="font-semibold">Suggestion:</span> {plotHole.aiSuggestion}
          </p>
        </div>
      )}

      {/* Actions */}
      {isOpen && (
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => onStatusChange(plotHole.id, 'resolved')}
            className="flex-1 text-[10px] font-medium px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
          >
            Resolved
          </button>
          <button
            onClick={() => onStatusChange(plotHole.id, 'ignored')}
            className="flex-1 text-[10px] font-medium px-2 py-1 rounded bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-colors"
          >
            Ignore
          </button>
        </div>
      )}

      {/* Reopen/Delete for non-open */}
      {!isOpen && (
        <div className="flex gap-1 mt-2">
          <button
            onClick={() => onStatusChange(plotHole.id, 'open')}
            className="flex-1 text-[10px] font-medium px-2 py-1 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
          >
            Reopen
          </button>
          <button
            onClick={() => onDelete(plotHole.id)}
            className="text-[10px] font-medium px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Panel
// -----------------------------------------------------------------------------

export default function PlotHolePanel() {
  const {
    activeProjectId,
    elements,
    connections,
    characters,
    plotHoles,
    isAnalyzingPlotHoles,
    setPlotHoles,
    addPlotHole,
    updatePlotHole: updatePlotHoleStore,
    removePlotHole,
    setAnalyzingPlotHoles,
  } = useStore()

  // Load plot holes on mount
  useEffect(() => {
    const loadPlotHoles = async () => {
      if (!activeProjectId) return
      const holes = await getPlotHolesByProject(activeProjectId)
      setPlotHoles(holes)
    }
    loadPlotHoles()
  }, [activeProjectId, setPlotHoles])

  // Run analysis
  const runAnalysis = useCallback(async () => {
    if (!activeProjectId) return

    setAnalyzingPlotHoles(true)

    try {
      // Detect issues
      const issues = detectPlotHoles({
        elements,
        connections,
        characters,
        projectId: activeProjectId,
      })

      // Convert to plot holes (filtering existing)
      const newHoles = issuesToPlotHoles(issues, activeProjectId, plotHoles)

      // Save new plot holes
      for (const hole of newHoles) {
        const created = await createPlotHole(
          hole.projectId,
          hole.description,
          hole.severity,
          hole.relatedElements,
          hole.aiSuggestion
        )
        addPlotHole(created)
      }
    } finally {
      setAnalyzingPlotHoles(false)
    }
  }, [activeProjectId, elements, connections, characters, plotHoles, setAnalyzingPlotHoles, addPlotHole])

  // Handle status change
  const handleStatusChange = useCallback(
    async (id: string, status: PlotHoleStatus) => {
      await updatePlotHoleDb(id, { status })
      updatePlotHoleStore(id, {
        status,
        resolvedAt: status === 'resolved' ? new Date() : undefined,
      })
    },
    [updatePlotHoleStore]
  )

  // Handle delete
  const handleDelete = useCallback(
    async (id: string) => {
      await deletePlotHoleDb(id)
      removePlotHole(id)
    },
    [removePlotHole]
  )

  // Separate open and closed
  const openHoles = plotHoles.filter((h) => h.status === 'open')
  const closedHoles = plotHoles.filter((h) => h.status !== 'open')

  return (
    <div className="h-full flex flex-col">
      {/* Header with Check Story Button */}
      <div className="p-3 border-b border-kwento-bg-tertiary">
        <button
          onClick={runAnalysis}
          disabled={isAnalyzingPlotHoles}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-kwento-accent text-kwento-bg-primary font-medium text-xs hover:bg-kwento-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzingPlotHoles ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Check Story
            </>
          )}
        </button>
        <p className="text-[10px] text-kwento-text-secondary text-center mt-1.5">
          Analyze your story for potential issues
        </p>
      </div>

      {/* Plot Holes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Open Issues */}
        {openHoles.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold text-kwento-text-secondary uppercase tracking-wider mb-2">
              Open Issues ({openHoles.length})
            </h3>
            <div className="space-y-2">
              {openHoles.map((hole) => (
                <PlotHoleCard
                  key={hole.id}
                  plotHole={hole}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Resolved/Ignored */}
        {closedHoles.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold text-kwento-text-secondary uppercase tracking-wider mb-2">
              Resolved / Ignored ({closedHoles.length})
            </h3>
            <div className="space-y-2">
              {closedHoles.map((hole) => (
                <PlotHoleCard
                  key={hole.id}
                  plotHole={hole}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {plotHoles.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-kwento-bg-tertiary flex items-center justify-center">
              <svg className="w-6 h-6 text-kwento-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-xs text-kwento-text-secondary">
              No issues detected yet.
            </p>
            <p className="text-[10px] text-kwento-text-secondary/70 mt-1">
              Click &ldquo;Check Story&rdquo; to analyze your narrative.
            </p>
          </div>
        )}

        {/* All Clear State */}
        {plotHoles.length > 0 && openHoles.length === 0 && (
          <div className="text-center py-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <svg className="w-8 h-8 mx-auto mb-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs font-medium text-green-400">
              All clear!
            </p>
            <p className="text-[10px] text-green-400/70 mt-0.5">
              No open issues in your story.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
