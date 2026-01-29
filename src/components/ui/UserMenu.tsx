'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSync } from '@/hooks/useSync'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const { lastSyncTime, fullSync, isSyncing } = useSync()
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
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
          {user.email?.[0].toUpperCase()}
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium text-white truncate max-w-[150px]">
            {user.email}
          </div>
          {lastSyncTime && (
            <div className="text-xs text-gray-400">
              Synced {formatSyncTime(lastSyncTime)}
            </div>
          )}
        </div>
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
              {lastSyncTime && (
                <div className="text-xs text-gray-400 mt-1">
                  Last synced: {lastSyncTime.toLocaleString()}
                </div>
              )}
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
