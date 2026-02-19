'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
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
    <main className="min-h-screen bg-kwento-bg-primary flex flex-col items-center justify-center p-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-kwento-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-kwento-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center space-y-6 max-w-2xl mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-kwento-accent">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              <path d="M8 7h8" />
              <path d="M8 11h6" />
            </svg>
            <h1 className="text-5xl font-bold text-kwento-text-primary group-hover:text-kwento-accent transition-colors">
              Kwento
            </h1>
          </Link>
          <p className="text-xl text-kwento-text-secondary">
            Get your stories out of your head.
          </p>
          <p className="text-kwento-text-secondary leading-relaxed">
            An AI-powered story development workspace that helps you extract
            fragmented ideas, visualize your narrative, and write complete stories.
          </p>
        </div>

        <AuthModal />
      </div>
    </main>
  )
}
