// =============================================================================
// KWENTO - Type Definitions
// Based on PRD v1.2 Data Models
// =============================================================================

// -----------------------------------------------------------------------------
// Enums & Union Types
// -----------------------------------------------------------------------------

export type Genre =
  | 'fantasy'
  | 'sci-fi'
  | 'mystery'
  | 'thriller'
  | 'romance'
  | 'horror'
  | 'literary'
  | 'historical'
  | 'adventure'
  | 'comedy'
  | 'drama'
  | 'other'

export type CharacterRole = 'protagonist' | 'antagonist' | 'supporting' | 'minor'

export type ElementType =
  | 'scene'
  | 'character'
  | 'location'
  | 'plot-point'
  | 'idea'
  | 'chapter'
  | 'conflict'
  | 'theme'
  | 'note'

export type Layer =
  | 'characters'
  | 'scenes'
  | 'plot'
  | 'timeline'
  | 'locations'
  | 'themes'
  | 'custom'
  | 'all'

// -----------------------------------------------------------------------------
// Custom Card Types
// -----------------------------------------------------------------------------

export type IconName =
  | 'scene'
  | 'character'
  | 'location'
  | 'plot-point'
  | 'idea'
  | 'chapter'
  | 'conflict'
  | 'theme'
  | 'note'
  | 'shield'
  | 'crown'
  | 'sword'
  | 'potion'
  | 'ring'
  | 'skull'
  | 'heart'
  | 'lightning'
  | 'key'
  | 'eye'
  | 'compass'
  | 'hourglass'
  | 'gem'
  | 'tower'
  | 'flag'
  | 'beast'
  | 'ship'
  | 'tree'
  | 'mask'
  | 'scroll'
  | 'pen'

export interface CustomCardType {
  id: string
  projectId: string
  name: string
  color: string
  icon: IconName
  layer: Layer
  createdAt: Date
  updatedAt: Date
}

export type PlotHoleSeverity = 'minor' | 'moderate' | 'major'
export type PlotHoleStatus = 'open' | 'resolved' | 'ignored'

export type ChapterStatus = 'not-started' | 'in-progress' | 'draft' | 'complete'

export type SeedType =
  | 'character-entry'
  | 'character-exit'
  | 'plot-point'
  | 'setting-change'
  | 'conflict'
  | 'foreshadowing'
  | 'reveal'
  | 'relationship'
  | 'custom'

export type SeedStatus = 'pending' | 'addressed' | 'skipped' | 'moved'

// -----------------------------------------------------------------------------
// Core Models
// -----------------------------------------------------------------------------

export interface Project {
  id: string
  title: string
  genre?: Genre
  synopsis?: string
  structure?: StoryStructure
  createdAt: Date
  updatedAt: Date
}

export interface StoryStructure {
  type: 'three-act' | 'five-act' | 'heroes-journey' | 'save-the-cat' | 'custom'
  beats: StoryBeat[]
}

export interface StoryBeat {
  id: string
  name: string
  description?: string
  order: number
  filled: boolean
  linkedElementId?: string
}

// -----------------------------------------------------------------------------
// Character
// -----------------------------------------------------------------------------

export interface Character {
  id: string
  projectId: string
  name: string
  role: CharacterRole
  physicalDescription?: string
  personality?: string[]
  backstory?: string
  goals?: string
  motivations?: string
  relationships?: Relationship[]
  arc?: string
  voiceNotes?: string
  notes?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export interface Relationship {
  characterId: string
  type: string
  description?: string
}

// -----------------------------------------------------------------------------
// Scene
// -----------------------------------------------------------------------------

export interface Scene {
  id: string
  projectId: string
  title: string
  summary: string
  characters: string[]
  location?: string
  timeframe?: string
  conflict?: string
  notes?: string
  order?: number
  actOrChapter?: string
  createdAt: Date
  updatedAt: Date
}

// -----------------------------------------------------------------------------
// Canvas Elements & Connections
// -----------------------------------------------------------------------------

export interface CanvasElement {
  id: string
  projectId: string
  type: ElementType
  customTypeId?: string // Reference to CustomCardType for custom elements
  referenceId?: string
  title: string
  content?: string
  position: Position
  size?: Size
  color?: string
  layer: Layer
  createdAt: Date
  updatedAt: Date
}

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Connection {
  id: string
  projectId: string
  sourceId: string
  targetId: string
  label?: string
  type?: string
  createdAt: Date
}

// -----------------------------------------------------------------------------
// Plot Holes
// -----------------------------------------------------------------------------

export interface PlotHole {
  id: string
  projectId: string
  description: string
  severity: PlotHoleSeverity
  relatedElements: string[]
  status: PlotHoleStatus
  aiSuggestion?: string
  createdAt: Date
  resolvedAt?: Date
}

// -----------------------------------------------------------------------------
// Conversation
// -----------------------------------------------------------------------------

export interface Conversation {
  id: string
  projectId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  extractedElements?: string[]
}

// -----------------------------------------------------------------------------
// Writing Mode
// -----------------------------------------------------------------------------

export interface Manuscript {
  id: string
  projectId: string
  title: string
  content: any // Rich text content as JSON (Tiptap format)
  wordCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Chapter {
  id: string
  projectId: string
  manuscriptId: string
  title: string
  order: number
  startPosition: number // Character position in manuscript where chapter starts
  endPosition: number // Character position where chapter ends
  status: ChapterStatus
  linkedScenes: string[]
  seedsTotal: number
  seedsAddressed: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface WritingSession {
  id: string
  projectId: string
  chapterId: string
  startedAt: Date
  endedAt?: Date
  wordsWritten: number
  aiAssistanceUsed: boolean
}

// -----------------------------------------------------------------------------
// Story Seeds
// -----------------------------------------------------------------------------

export interface StorySeed {
  id: string
  projectId: string
  chapterId: string
  type: SeedType
  title: string
  description?: string
  sourceElementId: string
  position: number
  status: SeedStatus
  addressedAt?: Date
  createdAt: Date
}

// -----------------------------------------------------------------------------
// Dialogue Context
// -----------------------------------------------------------------------------

export interface DialogueContext {
  id: string
  chapterId: string
  characterIds: string[]
  emotionalTone?: string
  relationshipDynamic?: string
  whatCharacterKnows: Record<string, string[]>
  sceneGoal?: string
}

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------

export interface StoryExport {
  id: string
  projectId: string
  format: 'docx' | 'pdf' | 'markdown' | 'fdx' | 'txt'
  includeOutline: boolean
  includeCharacterSheets: boolean
  includeFullStory: boolean
  exportedAt: Date
}
