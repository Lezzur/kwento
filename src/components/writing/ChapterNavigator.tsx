// =============================================================================
// KWENTO - Chapter Navigator (Writing View)
// =============================================================================

'use client'

import { useState, useEffect } from 'react'
import type { Editor } from '@tiptap/react'

interface ChapterItem {
  id: string
  title: string
  level: number
  position: number
}

interface ChapterNavigatorProps {
  editor: Editor | null
  onNavigate?: (position: number) => void
}

export default function ChapterNavigator({ editor, onNavigate }: ChapterNavigatorProps) {
  const [chapters, setChapters] = useState<ChapterItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentChapter, setCurrentChapter] = useState<string | null>(null)

  // Extract chapters from editor content
  useEffect(() => {
    if (!editor) return

    const extractChapters = () => {
      const doc = editor.state.doc
      const items: ChapterItem[] = []
      let position = 0

      doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const level = node.attrs.level
          const text = node.textContent

          items.push({
            id: `heading-${pos}`,
            title: text || `Heading ${level}`,
            level,
            position: pos,
          })
        }
        position = pos
      })

      setChapters(items)
    }

    extractChapters()

    // Re-extract when content updates
    editor.on('update', extractChapters)

    return () => {
      editor.off('update', extractChapters)
    }
  }, [editor])

  // Track current chapter based on cursor position
  useEffect(() => {
    if (!editor) return

    const updateCurrentChapter = () => {
      const { from } = editor.state.selection

      // Find the chapter that the cursor is in
      for (let i = chapters.length - 1; i >= 0; i--) {
        if (from >= chapters[i].position) {
          setCurrentChapter(chapters[i].id)
          return
        }
      }
      setCurrentChapter(null)
    }

    updateCurrentChapter()

    editor.on('selectionUpdate', updateCurrentChapter)

    return () => {
      editor.off('selectionUpdate', updateCurrentChapter)
    }
  }, [editor, chapters])

  const handleNavigate = (chapter: ChapterItem) => {
    if (!editor) return

    // Scroll to position
    editor.commands.focus()
    editor.commands.setTextSelection(chapter.position)

    // Scroll into view
    const node = editor.view.nodeDOM(chapter.position)
    if (node instanceof HTMLElement) {
      node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    onNavigate?.(chapter.position)
    setIsOpen(false)
  }

  if (chapters.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm text-slate-200 transition-colors"
      >
        <span>📑</span>
        <span>Chapters ({chapters.length})</span>
        <span className="text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-slate-500 uppercase font-semibold px-3 py-2">
                Navigate to Chapter
              </div>
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleNavigate(chapter)}
                  className={`
                    w-full text-left px-3 py-2 rounded transition-colors
                    ${currentChapter === chapter.id
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                    }
                  `}
                  style={{
                    paddingLeft: `${chapter.level * 12 + 12}px`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      H{chapter.level}
                    </span>
                    <span className="text-sm flex-1 truncate">
                      {chapter.title}
                    </span>
                    {currentChapter === chapter.id && (
                      <span className="text-xs">📍</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
