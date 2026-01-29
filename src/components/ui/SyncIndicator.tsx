'use client'

import { useSync } from '@/hooks/useSync'
import { useEffect, useState } from 'react'

export default function SyncIndicator() {
  const { isSyncing, syncError, pendingChanges } = useSync()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  let status: 'syncing' | 'synced' | 'offline' | 'error' | 'pending'
  let text: string
  let color: string

  if (syncError) {
    status = 'error'
    text = 'Sync Error'
    color = 'bg-red-500'
  } else if (!isOnline) {
    status = 'offline'
    text = 'Offline'
    color = 'bg-yellow-500'
  } else if (isSyncing) {
    status = 'syncing'
    text = 'Syncing...'
    color = 'bg-blue-500'
  } else if (pendingChanges > 0) {
    status = 'pending'
    text = `${pendingChanges} pending`
    color = 'bg-yellow-500'
  } else {
    status = 'synced'
    text = 'Synced'
    color = 'bg-green-500'
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg">
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        {status === 'syncing' && (
          <div className={`absolute inset-0 w-2 h-2 rounded-full ${color} animate-ping`} />
        )}
      </div>
      <span className="text-sm text-gray-300">{text}</span>
    </div>
  )
}
