// =============================================================================
// KWENTO - Writing View (Document Editor + Card Sidebar)
// =============================================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useStore } from '@/store'
import RichTextEditor from './RichTextEditor'
import CardReferenceSidebar from './CardReferenceSidebar'
import ChapterNavigator from './ChapterNavigator'
import { getManuscriptByProject, createManuscript, updateManuscript } from '@/lib/db'
import { debounce } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'
import type { Editor } from '@tiptap/react'

export default function WritingView() {
  const {
    activeProjectId,
    manuscript,
    setManuscript,
    updateManuscriptContent,
    isSavingManuscript,
    setSavingManuscript,
    setCurrentView,
  } = useStore()

  const [cardSidebarOpen, setCardSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [editor, setEditor] = useState<Editor | null>(null)
  const toast = useToast()

  // Load manuscript on mount or when project changes
  useEffect(() => {
    const loadManuscript = async () => {
      if (!activeProjectId) return

      setIsLoading(true)
      try {
        let ms = await getManuscriptByProject(activeProjectId)

        // Create manuscript if it doesn't exist
        if (!ms) {
          ms = await createManuscript(activeProjectId)
        }

        setManuscript(ms)
      } catch (error) {
        console.error('Failed to load manuscript:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadManuscript()
  }, [activeProjectId, setManuscript])

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (manuscriptId: string, content: any) => {
      try {
        await updateManuscript(manuscriptId, { content })
      } catch (error) {
        console.error('Failed to save manuscript:', error)
      } finally {
        setSavingManuscript(false)
      }
    }, 2000),
    []
  )

  // Handle content changes with auto-save
  const handleContentChange = (content: any) => {
    if (!manuscript) return

    updateManuscriptContent(content)
    setSavingManuscript(true)
    debouncedSave(manuscript.id, content)
  }

  // Manual save (Ctrl+S)
  const handleManualSave = async () => {
    if (!manuscript) return

    setSavingManuscript(true)
    try {
      await updateManuscript(manuscript.id, { content: manuscript.content })
      toast.success('Saved!')
    } catch (error) {
      console.error('Failed to save manuscript:', error)
      toast.error('Failed to save manuscript')
    } finally {
      setSavingManuscript(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-kwento-text-secondary">Loading manuscript...</div>
      </div>
    )
  }

  if (!manuscript) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-kwento-text-secondary">No manuscript found</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-kwento-bg-tertiary px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Back to Canvas Button */}
          <button
            onClick={() => setCurrentView('canvas')}
            className="px-3 py-1.5 rounded bg-kwento-bg-secondary hover:bg-kwento-bg-tertiary border border-kwento-bg-tertiary text-sm text-kwento-text-primary transition-colors"
            title="Back to Canvas"
          >
            ← Canvas
          </button>

          <input
            type="text"
            value={manuscript.title}
            onChange={(e) => {
              const title = e.target.value
              setManuscript({ ...manuscript, title })
              updateManuscript(manuscript.id, { title })
            }}
            className="text-base font-semibold bg-transparent border-none outline-none focus:outline-none text-kwento-text-primary placeholder-kwento-text-secondary"
            placeholder="Untitled Manuscript"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Chapter Navigator */}
          <ChapterNavigator editor={editor} />

          {/* Save Indicator */}
          <div className="text-sm text-kwento-text-secondary">
            {isSavingManuscript ? 'Saving...' : 'Saved'}
          </div>

          {/* Toggle Card Sidebar */}
          <button
            onClick={() => setCardSidebarOpen(!cardSidebarOpen)}
            className="px-3 py-1.5 rounded bg-kwento-bg-secondary hover:bg-kwento-bg-tertiary border border-kwento-bg-tertiary text-sm text-kwento-text-primary transition-colors"
            title={cardSidebarOpen ? 'Hide References' : 'Show References'}
          >
            {cardSidebarOpen ? 'Hide References' : 'Show References'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`flex-1 ${cardSidebarOpen ? 'border-r border-kwento-bg-tertiary' : ''}`}>
          <RichTextEditor
            content={manuscript.content}
            onChange={handleContentChange}
            onSave={handleManualSave}
            onEditorReady={setEditor}
          />
        </div>

        {/* Card Reference Sidebar */}
        {cardSidebarOpen && (
          <div className="w-80 overflow-hidden">
            <CardReferenceSidebar editor={editor} />
          </div>
        )}
      </div>
    </div>
  )
}
