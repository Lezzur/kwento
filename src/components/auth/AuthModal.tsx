'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default function AuthModal() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="bg-kwento-bg-secondary rounded-2xl shadow-2xl w-full max-w-md p-8 border border-kwento-bg-tertiary">
      <div className="flex rounded-lg bg-kwento-bg-primary p-1 mb-6">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
            mode === 'login'
              ? 'bg-kwento-accent text-gray-900 shadow-sm'
              : 'text-kwento-text-secondary hover:text-kwento-text-primary'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
            mode === 'signup'
              ? 'bg-kwento-accent text-gray-900 shadow-sm'
              : 'text-kwento-text-secondary hover:text-kwento-text-primary'
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-kwento-text-primary mb-1">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-sm text-kwento-text-secondary">
          {mode === 'login'
            ? 'Sign in to continue your stories'
            : 'Start crafting amazing narratives'}
        </p>
      </div>

      {mode === 'login' ? (
        <LoginForm onToggle={() => setMode('signup')} />
      ) : (
        <SignupForm onToggle={() => setMode('login')} />
      )}

      <p className="mt-6 text-xs text-center text-kwento-text-secondary">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-kwento-accent hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-kwento-accent hover:underline">Privacy Policy</a>.
      </p>
    </div>
  )
}
