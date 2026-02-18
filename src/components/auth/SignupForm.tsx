'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (!/\d/.test(pwd)) {
      return 'Password must contain at least one number'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return 'Password must contain at least one symbol (!@#$%^&*...)'
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const validationError = validatePassword(password)
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setSuccess(true)
        setLoading(false)
      }
    } catch (err) {
      console.error('Signup error:', err)
      setError('Unable to connect. Please check your internet connection and try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="text-center py-6">
          <div className="text-kwento-success text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-kwento-text-primary mb-2">Check your email</h3>
          <p className="text-kwento-text-secondary text-sm">
            We&apos;ve sent you a confirmation link to <span className="text-kwento-text-primary">{email}</span>
          </p>
        </div>
        <button
          onClick={onToggle}
          className="w-full px-4 py-3 bg-kwento-accent hover:bg-kwento-accent-secondary text-gray-900 rounded-lg font-medium transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    )
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
        <p className="mt-1 text-xs text-kwento-text-secondary">
          Must be 8+ characters with uppercase, lowercase, number, and symbol
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-kwento-text-primary mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded-lg text-kwento-text-primary placeholder-kwento-text-secondary focus:outline-none focus:ring-2 focus:ring-kwento-accent transition-all"
          placeholder="••••••••"
        />
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
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>

      <p className="text-sm text-center text-kwento-text-secondary">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-kwento-accent hover:text-kwento-accent-secondary font-medium transition-colors"
        >
          Sign in
        </button>
      </p>
    </form>
  )
}
