'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await resetPassword(email)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSubmitted(true)
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-kwento-bg-primary flex items-center justify-center p-8">
        <div className="bg-kwento-bg-secondary rounded-2xl shadow-2xl w-full max-w-md p-8 border border-kwento-bg-tertiary text-center space-y-4">
          <div className="text-kwento-success text-5xl">✓</div>
          <h1 className="text-xl font-semibold text-kwento-text-primary">Check your email</h1>
          <p className="text-kwento-text-secondary text-sm">
            We sent a reset link to{' '}
            <span className="text-kwento-text-primary">{email}</span>
          </p>
          <Link
            href="/"
            className="inline-block text-sm text-kwento-accent hover:text-kwento-accent-secondary font-medium transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-kwento-bg-primary flex items-center justify-center p-8">
      <div className="bg-kwento-bg-secondary rounded-2xl shadow-2xl w-full max-w-md p-8 border border-kwento-bg-tertiary">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-kwento-text-primary mb-2">Reset your password</h1>
          <p className="text-kwento-text-secondary text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

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
            {loading ? 'Sending…' : 'Send reset link'}
          </button>

          <p className="text-sm text-center text-kwento-text-secondary">
            Remembered it?{' '}
            <Link
              href="/"
              className="text-kwento-accent hover:text-kwento-accent-secondary font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
