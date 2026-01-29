import { db } from './db'
import { createClient } from './supabase/client'

export async function migrateLocalDataToUser(userId: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Check if user already has cloud data
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    // If user has cloud data, don't migrate (they're logging in from another device)
    if (existingProjects && existingProjects.length > 0) {
      console.log('User already has cloud data, skipping migration')
      return false
    }

    // Get all local data
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
      db.projects.toArray(),
      db.characters.toArray(),
      db.scenes.toArray(),
      db.canvasElements.toArray(),
      db.connections.toArray(),
      db.plotHoles.toArray(),
      db.conversations.toArray(),
      db.manuscripts.toArray(),
      db.chapters.toArray(),
      db.writingSessions.toArray(),
      db.storySeeds.toArray(),
      db.customCardTypes.toArray(),
    ])

    // If no local data, nothing to migrate
    if (projects.length === 0) {
      console.log('No local data to migrate')
      return false
    }

    console.log(`Migrating ${projects.length} projects to user ${userId}`)

    // Update all local records with userId and mark for sync
    await db.transaction('rw',
      [db.projects, db.characters, db.scenes, db.canvasElements, db.connections,
       db.plotHoles, db.conversations, db.manuscripts, db.chapters,
       db.writingSessions, db.storySeeds, db.customCardTypes],
      async () => {
        // Update projects
        for (const project of projects) {
          await db.projects.update(project.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update characters
        for (const character of characters) {
          await db.characters.update(character.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update scenes
        for (const scene of scenes) {
          await db.scenes.update(scene.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update canvas elements
        for (const element of canvasElements) {
          await db.canvasElements.update(element.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update connections
        for (const connection of connections) {
          await db.connections.update(connection.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update plot holes
        for (const plotHole of plotHoles) {
          await db.plotHoles.update(plotHole.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update conversations
        for (const conversation of conversations) {
          await db.conversations.update(conversation.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update manuscripts
        for (const manuscript of manuscripts) {
          await db.manuscripts.update(manuscript.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update chapters
        for (const chapter of chapters) {
          await db.chapters.update(chapter.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update writing sessions
        for (const session of writingSessions) {
          await db.writingSessions.update(session.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update story seeds
        for (const seed of storySeeds) {
          await db.storySeeds.update(seed.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }

        // Update custom card types
        for (const cardType of customCardTypes) {
          await db.customCardTypes.update(cardType.id, {
            userId,
            syncStatus: 'pending',
            deleted: false,
          })
        }
      }
    )

    console.log('Migration completed successfully')
    return true
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}
