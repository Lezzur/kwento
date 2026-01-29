import { createClient } from '../supabase/client'
import { db } from '../db'
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

export class SyncService {
  private supabase = createClient()

  async syncToCloud(userId: string): Promise<void> {
    console.log('Starting sync to cloud...')

    try {
      await Promise.all([
        this.syncProjects(userId),
        this.syncCharacters(userId),
        this.syncScenes(userId),
        this.syncCanvasElements(userId),
        this.syncConnections(userId),
        this.syncPlotHoles(userId),
        this.syncConversations(userId),
        this.syncManuscripts(userId),
        this.syncChapters(userId),
        this.syncWritingSessions(userId),
        this.syncStorySeeds(userId),
        this.syncCustomCardTypes(userId),
      ])

      console.log('Sync to cloud completed')
    } catch (error) {
      console.error('Sync to cloud failed:', error)
      throw error
    }
  }

  async syncFromCloud(userId: string): Promise<void> {
    console.log('Starting sync from cloud...')

    try {
      // Fetch all data from Supabase
      const [
        projects,
        characters,
        scenes,
        canvasElements,
        connections,
        plotHoles,
        conversations,
        manuscripts,
        chapters,
        writingSessions,
        storySeeds,
        customCardTypes,
      ] = await Promise.all([
        this.fetchProjects(userId),
        this.fetchCharacters(userId),
        this.fetchScenes(userId),
        this.fetchCanvasElements(userId),
        this.fetchConnections(userId),
        this.fetchPlotHoles(userId),
        this.fetchConversations(userId),
        this.fetchManuscripts(userId),
        this.fetchChapters(userId),
        this.fetchWritingSessions(userId),
        this.fetchStorySeeds(userId),
        this.fetchCustomCardTypes(userId),
      ])

      // Bulk insert to Dexie (upsert)
      await db.transaction('rw',
        [db.projects, db.characters, db.scenes, db.canvasElements, db.connections,
         db.plotHoles, db.conversations, db.manuscripts, db.chapters,
         db.writingSessions, db.storySeeds, db.customCardTypes],
        async () => {
          if (projects.length) await db.projects.bulkPut(projects)
          if (characters.length) await db.characters.bulkPut(characters)
          if (scenes.length) await db.scenes.bulkPut(scenes)
          if (canvasElements.length) await db.canvasElements.bulkPut(canvasElements)
          if (connections.length) await db.connections.bulkPut(connections)
          if (plotHoles.length) await db.plotHoles.bulkPut(plotHoles)
          if (conversations.length) await db.conversations.bulkPut(conversations)
          if (manuscripts.length) await db.manuscripts.bulkPut(manuscripts)
          if (chapters.length) await db.chapters.bulkPut(chapters)
          if (writingSessions.length) await db.writingSessions.bulkPut(writingSessions)
          if (storySeeds.length) await db.storySeeds.bulkPut(storySeeds)
          if (customCardTypes.length) await db.customCardTypes.bulkPut(customCardTypes)
        }
      )

      console.log('Sync from cloud completed')
    } catch (error) {
      console.error('Sync from cloud failed:', error)
      throw error
    }
  }

  private async syncProjects(userId: string) {
    const pending = await db.projects
      .where('syncStatus')
      .equals('pending')
      .and(p => p.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('projects')
      .upsert(pending.map(p => this.transformToSupabase(p, userId)))

    if (error) throw error

    await db.projects.bulkUpdate(
      pending.map(p => ({ key: p.id, changes: { syncStatus: 'synced' as const, lastSyncedAt: new Date() } }))
    )
  }

  private async syncCharacters(userId: string) {
    const pending = await db.characters
      .where('syncStatus')
      .equals('pending')
      .and(c => c.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('characters')
      .upsert(pending.map(c => this.transformToSupabase(c, userId)))

    if (error) throw error

    await db.characters.bulkUpdate(
      pending.map(c => ({ key: c.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncScenes(userId: string) {
    const pending = await db.scenes
      .where('syncStatus')
      .equals('pending')
      .and(s => s.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('scenes')
      .upsert(pending.map(s => this.transformToSupabase(s, userId)))

    if (error) throw error

    await db.scenes.bulkUpdate(
      pending.map(s => ({ key: s.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncCanvasElements(userId: string) {
    const pending = await db.canvasElements
      .where('syncStatus')
      .equals('pending')
      .and(e => e.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('canvas_elements')
      .upsert(pending.map(e => this.transformToSupabase(e, userId)))

    if (error) throw error

    await db.canvasElements.bulkUpdate(
      pending.map(e => ({ key: e.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncConnections(userId: string) {
    const pending = await db.connections
      .where('syncStatus')
      .equals('pending')
      .and(c => c.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('connections')
      .upsert(pending.map(c => this.transformToSupabase(c, userId)))

    if (error) throw error

    await db.connections.bulkUpdate(
      pending.map(c => ({ key: c.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncPlotHoles(userId: string) {
    const pending = await db.plotHoles
      .where('syncStatus')
      .equals('pending')
      .and(p => p.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('plot_holes')
      .upsert(pending.map(p => this.transformToSupabase(p, userId)))

    if (error) throw error

    await db.plotHoles.bulkUpdate(
      pending.map(p => ({ key: p.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncConversations(userId: string) {
    const pending = await db.conversations
      .where('syncStatus')
      .equals('pending')
      .and(c => c.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('conversations')
      .upsert(pending.map(c => this.transformToSupabase(c, userId)))

    if (error) throw error

    await db.conversations.bulkUpdate(
      pending.map(c => ({ key: c.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncManuscripts(userId: string) {
    const pending = await db.manuscripts
      .where('syncStatus')
      .equals('pending')
      .and(m => m.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('manuscripts')
      .upsert(pending.map(m => this.transformToSupabase(m, userId)))

    if (error) throw error

    await db.manuscripts.bulkUpdate(
      pending.map(m => ({ key: m.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncChapters(userId: string) {
    const pending = await db.chapters
      .where('syncStatus')
      .equals('pending')
      .and(c => c.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('chapters')
      .upsert(pending.map(c => this.transformToSupabase(c, userId)))

    if (error) throw error

    await db.chapters.bulkUpdate(
      pending.map(c => ({ key: c.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncWritingSessions(userId: string) {
    const pending = await db.writingSessions
      .where('syncStatus')
      .equals('pending')
      .and(w => w.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('writing_sessions')
      .upsert(pending.map(w => this.transformToSupabase(w, userId)))

    if (error) throw error

    await db.writingSessions.bulkUpdate(
      pending.map(w => ({ key: w.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncStorySeeds(userId: string) {
    const pending = await db.storySeeds
      .where('syncStatus')
      .equals('pending')
      .and(s => s.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('story_seeds')
      .upsert(pending.map(s => this.transformToSupabase(s, userId)))

    if (error) throw error

    await db.storySeeds.bulkUpdate(
      pending.map(s => ({ key: s.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async syncCustomCardTypes(userId: string) {
    const pending = await db.customCardTypes
      .where('syncStatus')
      .equals('pending')
      .and(c => c.userId === userId)
      .toArray()

    if (pending.length === 0) return

    const { error } = await this.supabase
      .from('custom_card_types')
      .upsert(pending.map(c => this.transformToSupabase(c, userId)))

    if (error) throw error

    await db.customCardTypes.bulkUpdate(
      pending.map(c => ({ key: c.id, changes: { syncStatus: 'synced' as const } }))
    )
  }

  private async fetchProjects(userId: string): Promise<Project[]> {
    const { data, error } = await this.supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchCharacters(userId: string): Promise<Character[]> {
    const { data, error } = await this.supabase
      .from('characters')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchScenes(userId: string): Promise<Scene[]> {
    const { data, error } = await this.supabase
      .from('scenes')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchCanvasElements(userId: string): Promise<CanvasElement[]> {
    const { data, error } = await this.supabase
      .from('canvas_elements')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchConnections(userId: string): Promise<Connection[]> {
    const { data, error } = await this.supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchPlotHoles(userId: string): Promise<PlotHole[]> {
    const { data, error } = await this.supabase
      .from('plot_holes')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchManuscripts(userId: string): Promise<Manuscript[]> {
    const { data, error } = await this.supabase
      .from('manuscripts')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchChapters(userId: string): Promise<Chapter[]> {
    const { data, error } = await this.supabase
      .from('chapters')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchWritingSessions(userId: string): Promise<WritingSession[]> {
    const { data, error } = await this.supabase
      .from('writing_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchStorySeeds(userId: string): Promise<StorySeed[]> {
    const { data, error } = await this.supabase
      .from('story_seeds')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private async fetchCustomCardTypes(userId: string): Promise<CustomCardType[]> {
    const { data, error } = await this.supabase
      .from('custom_card_types')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', false)

    if (error) throw error
    return this.transformFromSupabase(data || [])
  }

  private transformToSupabase(data: any, userId: string): any {
    const transformed: any = { ...data, user_id: userId }

    // Convert camelCase to snake_case for Supabase
    if (data.projectId) transformed.project_id = data.projectId
    if (data.manuscriptId) transformed.manuscript_id = data.manuscriptId
    if (data.chapterId) transformed.chapter_id = data.chapterId
    if (data.sourceId) transformed.source_id = data.sourceId
    if (data.targetId) transformed.target_id = data.targetId
    if (data.createdAt) transformed.created_at = data.createdAt
    if (data.updatedAt) transformed.updated_at = data.updatedAt
    if (data.syncStatus) transformed.sync_status = data.syncStatus
    if (data.lastSyncedAt) transformed.last_synced_at = data.lastSyncedAt

    // Set synced_at to now
    transformed.synced_at = new Date()

    return transformed
  }

  private transformFromSupabase(data: any[]): any[] {
    return data.map(item => {
      const transformed: any = { ...item }

      // Convert snake_case to camelCase for Dexie
      if (item.user_id) transformed.userId = item.user_id
      if (item.project_id) transformed.projectId = item.project_id
      if (item.manuscript_id) transformed.manuscriptId = item.manuscript_id
      if (item.chapter_id) transformed.chapterId = item.chapter_id
      if (item.source_id) transformed.sourceId = item.source_id
      if (item.target_id) transformed.targetId = item.target_id
      if (item.created_at) transformed.createdAt = new Date(item.created_at)
      if (item.updated_at) transformed.updatedAt = new Date(item.updated_at)
      if (item.synced_at) transformed.lastSyncedAt = new Date(item.synced_at)

      transformed.syncStatus = 'synced'

      // Clean up snake_case fields
      delete transformed.user_id
      delete transformed.project_id
      delete transformed.manuscript_id
      delete transformed.chapter_id
      delete transformed.source_id
      delete transformed.target_id
      delete transformed.created_at
      delete transformed.updated_at
      delete transformed.synced_at

      return transformed
    })
  }
}

export const syncService = new SyncService()
