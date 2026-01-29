// =============================================================================
// KWENTO - Auto Save Hook
// =============================================================================

import { useCallback, useRef, useEffect } from 'react'

/**
 * A hook that provides debounced auto-save functionality
 * @param saveFunction - The function to call when saving
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 */
export function useAutoSave<T>(
  saveFunction: (data: T) => Promise<void>,
  delay: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingDataRef = useRef<T | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        // Save any pending data on unmount
        if (pendingDataRef.current !== null) {
          saveFunction(pendingDataRef.current)
        }
      }
    }
  }, [saveFunction])

  const save = useCallback(
    (data: T) => {
      pendingDataRef.current = data

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(async () => {
        if (pendingDataRef.current !== null) {
          await saveFunction(pendingDataRef.current)
          pendingDataRef.current = null
        }
      }, delay)
    },
    [saveFunction, delay]
  )

  // Force immediate save
  const saveNow = useCallback(
    async (data: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      pendingDataRef.current = null
      await saveFunction(data)
    },
    [saveFunction]
  )

  return { save, saveNow }
}

/**
 * Batch save multiple items with debouncing
 */
export function useBatchAutoSave<T>(
  saveFunction: (items: Map<string, T>) => Promise<void>,
  delay: number = 500
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pendingItemsRef = useRef<Map<string, T>>(new Map())

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        // Save any pending data on unmount
        if (pendingItemsRef.current.size > 0) {
          saveFunction(pendingItemsRef.current)
        }
      }
    }
  }, [saveFunction])

  const queueSave = useCallback(
    (id: string, data: T) => {
      pendingItemsRef.current.set(id, data)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(async () => {
        if (pendingItemsRef.current.size > 0) {
          await saveFunction(pendingItemsRef.current)
          pendingItemsRef.current = new Map()
        }
      }, delay)
    },
    [saveFunction, delay]
  )

  return { queueSave }
}
