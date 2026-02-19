'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function SignupForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
        <p className="mt-1 text-xs text-kwento-text-secondary">
          Must be 8+ characters with uppercase, lowercase, number, and symbol
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-kwento-text-primary mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 pr-12 bg-kwento-bg-secondary border border-kwento-bg-tertiary rounded-lg text-kwento-text-primary placeholder-kwento-text-secondary focus:outline-none focus:ring-2 focus:ring-kwento-accent transition-all"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-kwento-text-secondary hover:text-kwento-text-primary transition-colors"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
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

    </form>
  )
}
