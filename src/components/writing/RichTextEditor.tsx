// =============================================================================
// KWENTO - Rich Text Editor (Tiptap)
// =============================================================================

'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface RichTextEditorProps {
  content: any
  onChange: (content: any) => void
  onSave?: () => void
  placeholder?: string
  editable?: boolean
  onEditorReady?: (editor: any) => void
}

export default function RichTextEditor({
  content,
  onChange,
  onSave,
  placeholder = 'Start writing your story...',
  editable = true,
  onEditorReady,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 hover:text-purple-300 underline cursor-pointer',
        },
      }),
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[calc(100vh-200px)] px-8 py-6',
      },
    },
  })

  // Update editor content when prop changes (e.g., loading new manuscript)
  useEffect(() => {
    if (editor && content && editor.getJSON() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor) {
      onEditorReady?.(editor)
    }
  }, [editor, onEditorReady])

  // Keyboard shortcut for save (Ctrl/Cmd + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        onSave?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onSave])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <EditorToolbar editor={editor} />

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Stats */}
      <div className="border-t border-slate-700 px-4 py-2 text-sm text-slate-400 flex items-center gap-4">
        <span>{editor.storage.characterCount.words()} words</span>
        <span>{editor.storage.characterCount.characters()} characters</span>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Toolbar Component
// -----------------------------------------------------------------------------

interface EditorToolbarProps {
  editor: any
}

function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null

  return (
    <div className="border-b border-slate-700 px-4 py-2 flex items-center gap-2 flex-wrap">
      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <BulletList />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numbered List"
      >
        <NumberedList />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      {/* Quotes & Code */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <Code />
      </ToolbarButton>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo (Ctrl+Z)"
      >
        <Undo />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo />
      </ToolbarButton>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Toolbar Button Component
// -----------------------------------------------------------------------------

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title?: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        px-2 py-1 rounded text-sm font-medium transition-colors
        ${isActive
          ? 'bg-purple-600 text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-700'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  )
}

// -----------------------------------------------------------------------------
// SVG Icons
// -----------------------------------------------------------------------------

function Bold() {
  return <span className="font-bold">B</span>
}

function Italic() {
  return <span className="italic">I</span>
}

function Strikethrough() {
  return <span className="line-through">S</span>
}

function BulletList() {
  return <span>• List</span>
}

function NumberedList() {
  return <span>1. List</span>
}

function Quote() {
  return <span>&quot;</span>
}

function Code() {
  return <span className="font-mono">&lt;/&gt;</span>
}

function Undo() {
  return <span>↶</span>
}

function Redo() {
  return <span>↷</span>
}
