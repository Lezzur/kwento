// =============================================================================
// KWENTO - Toast Notification System
// =============================================================================

'use client'

import { useEffect, useState, useCallback } from 'react'
import { create } from 'zustand'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

// -----------------------------------------------------------------------------
// Store
// -----------------------------------------------------------------------------

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = crypto.randomUUID()
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))

// -----------------------------------------------------------------------------
// Hook for convenience
// -----------------------------------------------------------------------------

export function useToast() {
  const { addToast } = useToastStore()

  return {
    success: useCallback((message: string) => addToast(message, 'success'), [addToast]),
    error: useCallback((message: string) => addToast(message, 'error'), [addToast]),
    info: useCallback((message: string) => addToast(message, 'info'), [addToast]),
  }
}

// -----------------------------------------------------------------------------
// Toast Item Component
// -----------------------------------------------------------------------------

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onRemove, 200)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onRemove])

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-kwento-accent',
  }[toast.type]

  const icon = {
    success: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }[toast.type]

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-white text-sm font-medium
        ${bgColor}
        ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}
      `}
    >
      {icon}
      {toast.message}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Toast Container Component
// -----------------------------------------------------------------------------

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}
