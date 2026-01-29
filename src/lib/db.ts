// =============================================================================
// KWENTO - Dexie Database (Local-First Storage)
// =============================================================================

import Dexie, { type EntityTable } from 'dexie'
import type {
  Project,
  Character,
  Scene,
  CanvasElement,
  Connection,
  PlotHole,
  Conversation,
  Manuscript,
  Chapter,
  WritingSession,
  StorySeed,
  CustomCardType,
} from '@/types'

// -----------------------------------------------------------------------------
// Database Schema
// -----------------------------------------------------------------------------

class KwentoDatabase extends Dexie {
  projects!: EntityTable<Project, 'id'>
  characters!: EntityTable<Character, 'id'>
  scenes!: EntityTable<Scene, 'id'>
  canvasElements!: EntityTable<CanvasElement, 'id'>
  connections!: EntityTable<Connection, 'id'>
  plotHoles!: EntityTable<PlotHole, 'id'>
  conversations!: EntityTable<Conversation, 'id'>
  manuscripts!: EntityTable<Manuscript, 'id'>
  chapters!: EntityTable<Chapter, 'id'>
  writingSessions!: EntityTable<WritingSession, 'id'>
  storySeeds!: EntityTable<StorySeed, 'id'>
  customCardTypes!: EntityTable<CustomCardType, 'id'>

  constructor() {
    super('KwentoDB')

    this.version(1).stores({
      // Primary key is 'id', indexed fields follow
      projects: 'id, title, genre, createdAt, updatedAt',
      characters: 'id, projectId, name, role, createdAt',
      scenes: 'id, projectId, title, order, createdAt',
      canvasElements: 'id, projectId, type, layer, createdAt',
      connections: 'id, projectId, sourceId, targetId, createdAt',
      plotHoles: 'id, projectId, severity, status, createdAt',
      conversations: 'id, projectId, createdAt, updatedAt',
      chapters: 'id, projectId, order, status, createdAt',
      writingSessions: 'id, projectId, chapterId, startedAt',
      storySeeds: 'id, projectId, chapterId, type, status, createdAt',
    })

    // Version 2: Add custom card types
    this.version(2).stores({
      projects: 'id, title, genre, createdAt, updatedAt',
      characters: 'id, projectId, name, role, createdAt',
      scenes: 'id, projectId, title, order, createdAt',
      canvasElements: 'id, projectId, type, layer, createdAt',
      connections: 'id, projectId, sourceId, targetId, createdAt',
      plotHoles: 'id, projectId, severity, status, createdAt',
      conversations: 'id, projectId, createdAt, updatedAt',
      chapters: 'id, projectId, order, status, createdAt',
      writingSessions: 'id, projectId, chapterId, startedAt',
      storySeeds: 'id, projectId, chapterId, type, status, createdAt',
      customCardTypes: 'id, projectId, name, createdAt',
    })

    // Version 3: Add manuscripts for rich text editing
    this.version(3).stores({
      projects: 'id, title, genre, createdAt, updatedAt',
      characters: 'id, projectId, name, role, createdAt',
      scenes: 'id, projectId, title, order, createdAt',
      canvasElements: 'id, projectId, type, layer, createdAt',
      connections: 'id, projectId, sourceId, targetId, createdAt',
      plotHoles: 'id, projectId, severity, status, createdAt',
      conversations: 'id, projectId, createdAt, updatedAt',
      manuscripts: 'id, projectId, title, createdAt, updatedAt',
      chapters: 'id, projectId, manuscriptId, order, createdAt',
      writingSessions: 'id, projectId, chapterId, startedAt',
      storySeeds: 'id, projectId, chapterId, type, status, createdAt',
      customCardTypes: 'id, projectId, name, createdAt',
    })

    // Version 4: Add sync fields for cloud sync
    this.version(4).stores({
      projects: 'id, title, genre, createdAt, updatedAt, userId, syncStatus, lastSyncedAt',
      characters: 'id, projectId, name, role, createdAt, userId, syncStatus',
      scenes: 'id, projectId, title, order, createdAt, userId, syncStatus',
      canvasElements: 'id, projectId, type, layer, createdAt, userId, syncStatus',
      connections: 'id, projectId, sourceId, targetId, createdAt, userId, syncStatus',
      plotHoles: 'id, projectId, severity, status, createdAt, userId, syncStatus',
      conversations: 'id, projectId, createdAt, updatedAt, userId, syncStatus',
      manuscripts: 'id, projectId, title, createdAt, updatedAt, userId, syncStatus',
      chapters: 'id, projectId, manuscriptId, order, createdAt, userId, syncStatus',
      writingSessions: 'id, projectId, chapterId, startedAt, userId, syncStatus',
      storySeeds: 'id, projectId, chapterId, type, status, createdAt, userId, syncStatus',
      customCardTypes: 'id, projectId, name, createdAt, userId, syncStatus',
    }).upgrade(async (trans) => {
      // Add sync fields to all existing records
      await trans.table('projects').toCollection().modify((project: any) => {
        project.userId = null
        project.syncStatus = 'pending'
        project.lastSyncedAt = null
        project.deleted = false
      })
      await trans.table('characters').toCollection().modify((character: any) => {
        character.userId = null
        character.syncStatus = 'pending'
        character.deleted = false
      })
      await trans.table('scenes').toCollection().modify((scene: any) => {
        scene.userId = null
        scene.syncStatus = 'pending'
        scene.deleted = false
      })
      await trans.table('canvasElements').toCollection().modify((element: any) => {
        element.userId = null
        element.syncStatus = 'pending'
        element.deleted = false
      })
      await trans.table('connections').toCollection().modify((connection: any) => {
        connection.userId = null
        connection.syncStatus = 'pending'
        connection.deleted = false
      })
      await trans.table('plotHoles').toCollection().modify((plotHole: any) => {
        plotHole.userId = null
        plotHole.syncStatus = 'pending'
        plotHole.deleted = false
      })
      await trans.table('conversations').toCollection().modify((conversation: any) => {
        conversation.userId = null
        conversation.syncStatus = 'pending'
        conversation.deleted = false
      })
      await trans.table('manuscripts').toCollection().modify((manuscript: any) => {
        manuscript.userId = null
        manuscript.syncStatus = 'pending'
        manuscript.deleted = false
      })
      await trans.table('chapters').toCollection().modify((chapter: any) => {
        chapter.userId = null
        chapter.syncStatus = 'pending'
        chapter.deleted = false
      })
      await trans.table('writingSessions').toCollection().modify((session: any) => {
        session.userId = null
        session.syncStatus = 'pending'
        session.deleted = false
      })
      await trans.table('storySeeds').toCollection().modify((seed: any) => {
        seed.userId = null
        seed.syncStatus = 'pending'
        seed.deleted = false
      })
      await trans.table('customCardTypes').toCollection().modify((cardType: any) => {
        cardType.userId = null
        cardType.syncStatus = 'pending'
        cardType.deleted = false
      })
    })
  }
}

// -----------------------------------------------------------------------------
// Database Instance
// -----------------------------------------------------------------------------

export const db = new KwentoDatabase()

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Get current timestamp
 */
export function now(): Date {
  return new Date()
}

// -----------------------------------------------------------------------------
// Project Operations
// -----------------------------------------------------------------------------

export async function createProject(title: string, genre?: Project['genre']): Promise<Project> {
  const project: Project = {
    id: generateId(),
    title,
    genre,
    createdAt: now(),
    updatedAt: now(),
    syncStatus: 'pending',
  }
  await db.projects.add(project)
  return project
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id)
}

export async function getAllProjects(): Promise<Project[]> {
  return db.projects.orderBy('updatedAt').reverse().toArray()
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  await db.projects.update(id, { ...updates, updatedAt: now(), syncStatus: 'pending' })
}

export async function deleteProject(id: string): Promise<void> {
  // Delete all related data
  await db.transaction('rw',
    [db.projects, db.characters, db.scenes, db.canvasElements,
     db.connections, db.plotHoles, db.conversations, db.manuscripts,
     db.chapters, db.writingSessions, db.storySeeds, db.customCardTypes],
    async () => {
      await db.characters.where('projectId').equals(id).delete()
      await db.scenes.where('projectId').equals(id).delete()
      await db.canvasElements.where('projectId').equals(id).delete()
      await db.connections.where('projectId').equals(id).delete()
      await db.plotHoles.where('projectId').equals(id).delete()
      await db.conversations.where('projectId').equals(id).delete()
      await db.manuscripts.where('projectId').equals(id).delete()
      await db.chapters.where('projectId').equals(id).delete()
      await db.writingSessions.where('projectId').equals(id).delete()
      await db.storySeeds.where('projectId').equals(id).delete()
      await db.customCardTypes.where('projectId').equals(id).delete()
      await db.projects.delete(id)
    }
  )
}

// -----------------------------------------------------------------------------
// Character Operations
// -----------------------------------------------------------------------------

export async function createCharacter(
  projectId: string,
  name: string,
  role: Character['role']
): Promise<Character> {
  const character: Character = {
    id: generateId(),
    projectId,
    name,
    role,
    createdAt: now(),
    updatedAt: now(),
    syncStatus: 'pending',
  }
  await db.characters.add(character)
  return character
}

export async function getCharactersByProject(projectId: string): Promise<Character[]> {
  return db.characters.where('projectId').equals(projectId).toArray()
}

export async function updateCharacter(id: string, updates: Partial<Character>): Promise<void> {
  await db.characters.update(id, { ...updates, updatedAt: now(), syncStatus: 'pending' })
}

export async function deleteCharacter(id: string): Promise<void> {
  await db.characters.delete(id)
}

// -----------------------------------------------------------------------------
// Canvas Element Operations
// -----------------------------------------------------------------------------

export async function createCanvasElement(
  projectId: string,
  type: CanvasElement['type'],
  title: string,
  position: CanvasElement['position'],
  layer: CanvasElement['layer'] = 'all'
): Promise<CanvasElement> {
  const element: CanvasElement = {
    id: generateId(),
    projectId,
    type,
    title,
    position,
    layer,
    createdAt: now(),
    updatedAt: now(),
    syncStatus: 'pending',
  }
  await db.canvasElements.add(element)
  return element
}

export async function getElementsByProject(projectId: string): Promise<CanvasElement[]> {
  return db.canvasElements.where('projectId').equals(projectId).toArray()
}

export async function updateCanvasElement(id: string, updates: Partial<CanvasElement>): Promise<void> {
  await db.canvasElements.update(id, { ...updates, updatedAt: now(), syncStatus: 'pending' })
}

export async function deleteCanvasElement(id: string): Promise<void> {
  // Also delete connections involving this element
  await db.transaction('rw', [db.canvasElements, db.connections], async () => {
    await db.connections.where('sourceId').equals(id).delete()
    await db.connections.where('targetId').equals(id).delete()
    await db.canvasElements.delete(id)
  })
}

// -----------------------------------------------------------------------------
// Connection Operations
// -----------------------------------------------------------------------------

export async function createConnection(
  projectId: string,
  sourceId: string,
  targetId: string,
  label?: string,
  type?: string
): Promise<Connection> {
  const connection: Connection = {
    id: generateId(),
    projectId,
    sourceId,
    targetId,
    label,
    type,
    createdAt: now(),
    syncStatus: 'pending',
  }
  await db.connections.add(connection)
  return connection
}

export async function getConnectionsByProject(projectId: string): Promise<Connection[]> {
  return db.connections.where('projectId').equals(projectId).toArray()
}

export async function deleteConnection(id: string): Promise<void> {
  await db.connections.delete(id)
}

export async function updateConnection(
  id: string,
  updates: Partial<Pick<Connection, 'label' | 'type'>>
): Promise<void> {
  await db.connections.update(id, { ...updates, syncStatus: 'pending' })
}

// -----------------------------------------------------------------------------
// Manuscript Operations
// -----------------------------------------------------------------------------

export async function createManuscript(
  projectId: string,
  title: string = 'Untitled Manuscript'
): Promise<Manuscript> {
  const manuscript: Manuscript = {
    id: generateId(),
    projectId,
    title,
    content: {
      type: 'doc',
      content: [{ type: 'paragraph' }],
    }, // Empty Tiptap document
    wordCount: 0,
    createdAt: now(),
    updatedAt: now(),
    syncStatus: 'pending',
  }
  await db.manuscripts.add(manuscript)
  return manuscript
}

export async function getManuscriptByProject(projectId: string): Promise<Manuscript | undefined> {
  const manuscripts = await db.manuscripts.where('projectId').equals(projectId).toArray()
  return manuscripts[0] // One manuscript per project
}

export async function updateManuscript(id: string, updates: Partial<Manuscript>): Promise<void> {
  // Auto-calculate word count if content is updated
  if (updates.content !== undefined) {
    const text = extractTextFromTiptap(updates.content)
    updates.wordCount = text.trim().split(/\s+/).filter(Boolean).length
  }
  await db.manuscripts.update(id, { ...updates, updatedAt: now(), syncStatus: 'pending' })
}

export async function deleteManuscript(id: string): Promise<void> {
  await db.manuscripts.delete(id)
}

/**
 * Extract plain text from Tiptap JSON for word counting
 */
function extractTextFromTiptap(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content

  let text = ''

  if (content.content && Array.isArray(content.content)) {
    for (const node of content.content) {
      text += extractTextFromTiptap(node) + ' '
    }
  }

  if (content.text) {
    text += content.text
  }

  return text
}

// -----------------------------------------------------------------------------
// Chapter Operations
// -----------------------------------------------------------------------------

export async function createChapter(
  projectId: string,
  manuscriptId: string,
  title: string,
  order: number,
  startPosition: number = 0,
  endPosition: number = 0
): Promise<Chapter> {
  const chapter: Chapter = {
    id: generateId(),
    projectId,
    manuscriptId,
    title,
    order,
    startPosition,
    endPosition,
    status: 'not-started',
    linkedScenes: [],
    seedsTotal: 0,
    seedsAddressed: 0,
    createdAt: now(),
    updatedAt: now(),
    syncStatus: 'pending',
  }
  await db.chapters.add(chapter)
  return chapter
}

export async function getChaptersByProject(projectId: string): Promise<Chapter[]> {
  return db.chapters.where('projectId').equals(projectId).sortBy('order')
}

export async function getChaptersByManuscript(manuscriptId: string): Promise<Chapter[]> {
  return db.chapters.where('manuscriptId').equals(manuscriptId).sortBy('order')
}

export async function updateChapter(id: string, updates: Partial<Chapter>): Promise<void> {
  await db.chapters.update(id, { ...updates, updatedAt: now(), syncStatus: 'pending' })
}

export async function deleteChapter(id: string): Promise<void> {
  await db.chapters.delete(id)
}

// -----------------------------------------------------------------------------
// Plot Hole Operations
// -----------------------------------------------------------------------------

export async function createPlotHole(
  projectId: string,
  description: string,
  severity: PlotHole['severity'],
  relatedElements: string[] = [],
  aiSuggestion?: string
): Promise<PlotHole> {
  const plotHole: PlotHole = {
    id: generateId(),
    projectId,
    description,
    severity,
    relatedElements,
    status: 'open',
    aiSuggestion,
    createdAt: now(),
    syncStatus: 'pending',
  }
  await db.plotHoles.add(plotHole)
  return plotHole
}

export async function getPlotHolesByProject(projectId: string): Promise<PlotHole[]> {
  return db.plotHoles.where('projectId').equals(projectId).toArray()
}

export async function updatePlotHole(id: string, updates: Partial<PlotHole>): Promise<void> {
  if (updates.status === 'resolved') {
    updates.resolvedAt = now()
  }
  await db.plotHoles.update(id, { ...updates, syncStatus: 'pending' })
}

export async function deletePlotHole(id: string): Promise<void> {
  await db.plotHoles.delete(id)
}

// -----------------------------------------------------------------------------
// Clear Project Data (Reset)
// -----------------------------------------------------------------------------

/**
 * Clears all content data for a project but keeps the project itself.
 * This resets the canvas, characters, chapters, etc. to a fresh state.
 */
export async function clearProjectData(projectId: string): Promise<void> {
  await db.transaction('rw',
    [db.characters, db.scenes, db.canvasElements, db.connections,
     db.plotHoles, db.conversations, db.manuscripts, db.chapters, db.writingSessions, db.storySeeds],
    async () => {
      await db.characters.where('projectId').equals(projectId).delete()
      await db.scenes.where('projectId').equals(projectId).delete()
      await db.canvasElements.where('projectId').equals(projectId).delete()
      await db.connections.where('projectId').equals(projectId).delete()
      await db.plotHoles.where('projectId').equals(projectId).delete()
      await db.conversations.where('projectId').equals(projectId).delete()
      await db.manuscripts.where('projectId').equals(projectId).delete()
      await db.chapters.where('projectId').equals(projectId).delete()
      await db.writingSessions.where('projectId').equals(projectId).delete()
      await db.storySeeds.where('projectId').equals(projectId).delete()
    }
  )
}

// -----------------------------------------------------------------------------
// Custom Card Type Operations
// -----------------------------------------------------------------------------

export async function createCustomCardType(
  projectId: string,
  name: string,
  color: string,
  icon: CustomCardType['icon'],
  layer: CustomCardType['layer'] = 'custom'
): Promise<CustomCardType> {
  const cardType: CustomCardType = {
    id: generateId(),
    projectId,
    name,
    color,
    icon,
    layer,
    createdAt: now(),
    updatedAt: now(),
    syncStatus: 'pending',
  }
  await db.customCardTypes.add(cardType)
  return cardType
}

export async function getCustomCardTypesByProject(projectId: string): Promise<CustomCardType[]> {
  return db.customCardTypes.where('projectId').equals(projectId).toArray()
}

export async function updateCustomCardType(id: string, updates: Partial<CustomCardType>): Promise<void> {
  await db.customCardTypes.update(id, { ...updates, updatedAt: now(), syncStatus: 'pending' })
}

export async function deleteCustomCardType(id: string): Promise<void> {
  await db.customCardTypes.delete(id)
}
