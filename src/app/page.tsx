'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AuthModal from '@/components/auth/AuthModal'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/workspace')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <main className="min-h-screen bg-kwento-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-kwento-accent"></div>
          <p className="mt-4 text-kwento-text-secondary">Loading...</p>
        </div>
      </main>
    )
  }

  if (user) {
    return null
  }

  return (
    <main className="min-h-screen bg-kwento-bg-primary flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl mb-8">
        <h1 className="text-5xl font-bold text-kwento-text-primary">
          Kwento
        </h1>
        <p className="text-xl text-kwento-text-secondary">
          Get your stories out of your head.
        </p>
        <p className="text-kwento-text-secondary leading-relaxed">
          An AI-powered story development workspace that helps you extract
          fragmented ideas, visualize your narrative, and write complete stories.
        </p>
      </div>

      <AuthModal />
    </main>
  )
}
