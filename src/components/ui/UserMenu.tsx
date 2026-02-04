'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSync } from '@/hooks/useSync'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { lastSyncTime, fullSync, isSyncing, syncError } = useSync()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const handleSync = () => {
    fullSync()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm text-kwento-text-secondary hover:text-kwento-text-primary transition-colors truncate max-w-[200px]"
      >
        {user.email}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
            <div className="p-4 border-b border-gray-700">
              <div className="text-sm font-medium text-white truncate">
                {user.email}
              </div>
              <div className="flex items-center gap-2 mt-2">
                {syncError ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs text-red-400">Sync Error</span>
                  </>
                ) : isSyncing ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs text-blue-400">Syncing...</span>
                  </>
                ) : lastSyncTime ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-400">
                      Synced {formatSyncTime(lastSyncTime)}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    <span className="text-xs text-gray-400">Not synced</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function formatSyncTime(time: Date): string {
  const now = new Date()
  const diff = now.getTime() - time.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return time.toLocaleDateString()
}
