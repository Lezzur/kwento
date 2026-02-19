'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Unable to connect. Please check your internet connection and try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-kwento-text-primary mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded-lg text-kwento-text-primary placeholder-kwento-text-secondary focus:outline-none focus:ring-2 focus:ring-kwento-accent transition-all"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-kwento-text-primary mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pr-12 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded-lg text-kwento-text-primary placeholder-kwento-text-secondary focus:outline-none focus:ring-2 focus:ring-kwento-accent transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-kwento-text-secondary hover:text-kwento-text-primary transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-kwento-text-secondary hover:text-kwento-accent transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {error && (
        <div className="text-sm text-kwento-error bg-kwento-error/10 border border-kwento-error/30 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-kwento-accent hover:bg-kwento-accent-secondary disabled:bg-kwento-bg-tertiary disabled:text-kwento-text-secondary text-gray-900 rounded-lg font-medium transition-colors"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

    </form>
  )
}
