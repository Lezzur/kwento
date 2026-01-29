'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { syncService } from '@/lib/sync/syncService'
import { migrateLocalDataToUser } from '@/lib/migration'
import { getPendingChanges } from '@/lib/sync/offlineQueue'

export function useSync() {
  const { user } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [pendingChanges, setPendingChanges] = useState(0)

  const syncToCloud = useCallback(async () => {
    if (!user) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      await syncService.syncToCloud(user.id)
      setLastSyncTime(new Date())

      const pending = await getPendingChanges(user.id)
      setPendingChanges(pending)
    } catch (error) {
      console.error('Sync to cloud failed:', error)
      setSyncError(error instanceof Error ? error.message : 'Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }, [user])

  const syncFromCloud = useCallback(async () => {
    if (!user) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      await syncService.syncFromCloud(user.id)
      setLastSyncTime(new Date())

      const pending = await getPendingChanges(user.id)
      setPendingChanges(pending)
    } catch (error) {
      console.error('Sync from cloud failed:', error)
      setSyncError(error instanceof Error ? error.message : 'Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }, [user])

  const fullSync = useCallback(async () => {
    if (!user) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      // First sync to cloud (push local changes)
      await syncService.syncToCloud(user.id)
      // Then sync from cloud (pull remote changes)
      await syncService.syncFromCloud(user.id)

      setLastSyncTime(new Date())
      setPendingChanges(0)
    } catch (error) {
      console.error('Full sync failed:', error)
      setSyncError(error instanceof Error ? error.message : 'Sync failed')
    } finally {
      setIsSyncing(false)
    }
  }, [user])

  // Auto-sync on login (with migration)
  useEffect(() => {
    if (!user) return

    const initSync = async () => {
      try {
        // Migrate local data to user on first login
        const migrated = await migrateLocalDataToUser(user.id)

        if (migrated) {
          // If migration happened, sync to cloud
          await syncToCloud()
        } else {
          // Otherwise, do a full sync
          await fullSync()
        }
      } catch (error) {
        console.error('Initial sync failed:', error)
      }
    }

    initSync()
  }, [user?.id, syncToCloud, fullSync]) // eslint-disable-line react-hooks/exhaustive-deps

  // Periodic sync every 5 minutes
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fullSync()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [user, fullSync])

  // Sync on window focus
  useEffect(() => {
    if (!user) return

    const handleFocus = () => {
      fullSync()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user, fullSync])

  // Sync before window unload
  useEffect(() => {
    if (!user) return

    const handleBeforeUnload = () => {
      // This is a best-effort sync; browser may kill it
      syncToCloud()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [user, syncToCloud])

  // Check for pending changes periodically
  useEffect(() => {
    if (!user) return

    const checkPending = async () => {
      const pending = await getPendingChanges(user.id)
      setPendingChanges(pending)
    }

    checkPending()

    const interval = setInterval(checkPending, 30 * 1000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [user])

  return {
    isSyncing,
    lastSyncTime,
    syncError,
    pendingChanges,
    syncToCloud,
    syncFromCloud,
    fullSync,
  }
}
