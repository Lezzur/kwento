'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded-lg text-kwento-text-primary placeholder-kwento-text-secondary focus:outline-none focus:ring-2 focus:ring-kwento-accent transition-all"
          placeholder="••••••••"
        />
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

      <p className="text-sm text-center text-kwento-text-secondary">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-kwento-accent hover:text-kwento-accent-secondary font-medium transition-colors"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}
