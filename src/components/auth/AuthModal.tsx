'use client'

import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'

export default function AuthModal() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-kwento-bg-secondary rounded-2xl shadow-2xl w-full max-w-md p-8 border border-kwento-bg-tertiary">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-kwento-text-primary mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-kwento-text-secondary">
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
      </div>
    </div>
  )
}
