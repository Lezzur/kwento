import { db } from '../db'

export async function markForSync(table: string, id: string): Promise<void> {
  const dbTable = (db as any)[table]
  if (!dbTable) {
    console.error(`Table ${table} not found`)
    return
  }

  await dbTable.update(id, { syncStatus: 'pending' })
}

export async function getPendingChanges(userId: string): Promise<number> {
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
    db.projects.where('syncStatus').equals('pending').and(p => p.userId === userId).count(),
    db.characters.where('syncStatus').equals('pending').and(c => c.userId === userId).count(),
    db.scenes.where('syncStatus').equals('pending').and(s => s.userId === userId).count(),
    db.canvasElements.where('syncStatus').equals('pending').and(e => e.userId === userId).count(),
    db.connections.where('syncStatus').equals('pending').and(c => c.userId === userId).count(),
    db.plotHoles.where('syncStatus').equals('pending').and(p => p.userId === userId).count(),
    db.conversations.where('syncStatus').equals('pending').and(c => c.userId === userId).count(),
    db.manuscripts.where('syncStatus').equals('pending').and(m => m.userId === userId).count(),
    db.chapters.where('syncStatus').equals('pending').and(c => c.userId === userId).count(),
    db.writingSessions.where('syncStatus').equals('pending').and(w => w.userId === userId).count(),
    db.storySeeds.where('syncStatus').equals('pending').and(s => s.userId === userId).count(),
    db.customCardTypes.where('syncStatus').equals('pending').and(c => c.userId === userId).count(),
  ])

  return (
    projects +
    characters +
    scenes +
    canvasElements +
    connections +
    plotHoles +
    conversations +
    manuscripts +
    chapters +
    writingSessions +
    storySeeds +
    customCardTypes
  )
}
