// =============================================================================
// KWENTO - Utility Functions
// =============================================================================

/**
 * Debounce function - delays execution until after wait milliseconds have passed
 * since the last time the function was invoked
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function - ensures function is called at most once per wait period
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return function executedFunction(...args: Parameters<T>) {
    const now = Date.now()

    if (now - lastCall >= wait) {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * Generate a random color from a predefined palette
 */
export function randomColor(): string {
  const colors = [
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // green
    '#3B82F6', // blue
    '#EF4444', // red
    '#06B6D4', // cyan
    '#8B5A3C', // brown
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Format a date as a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`

  return date.toLocaleDateString()
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
