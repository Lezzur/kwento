// =============================================================================
// KWENTO - Element Extractor
// Parses AI responses for story elements and creates canvas nodes
// =============================================================================

import type { ElementType } from '@/types'

export interface ExtractedElement {
  type: ElementType
  title: string
  content?: string
}

// Element markers in AI responses
// Format: [TYPE: Title] or [TYPE: Title | Description]
const ELEMENT_PATTERN = /\[([A-Z-]+):\s*([^\]|]+)(?:\s*\|\s*([^\]]+))?\]/g

// Map AI markers to element types
const TYPE_MAP: Record<string, ElementType> = {
  'CHARACTER': 'character',
  'SCENE': 'scene',
  'LOCATION': 'location',
  'PLOT': 'plot-point',
  'PLOT-POINT': 'plot-point',
  'IDEA': 'idea',
  'CHAPTER': 'chapter',
  'CONFLICT': 'conflict',
  'THEME': 'theme',
  'NOTE': 'note',
}

/**
 * Extract story elements from AI response text
 */
export function extractElements(text: string): ExtractedElement[] {
  const elements: ExtractedElement[] = []
  let match

  while ((match = ELEMENT_PATTERN.exec(text)) !== null) {
    const [, typeStr, title, description] = match
    const type = TYPE_MAP[typeStr.toUpperCase()]

    if (type) {
      elements.push({
        type,
        title: title.trim(),
        content: description?.trim(),
      })
    }
  }

  return elements
}

/**
 * Remove element markers from text for clean display
 */
export function cleanResponseText(text: string): string {
  return text.replace(ELEMENT_PATTERN, '**$2**').trim()
}

/**
 * Check if response contains extractable elements
 */
export function hasElements(text: string): boolean {
  ELEMENT_PATTERN.lastIndex = 0
  return ELEMENT_PATTERN.test(text)
}
