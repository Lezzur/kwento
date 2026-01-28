import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-kwento-bg-primary flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Logo/Title */}
        <h1 className="text-5xl font-bold text-kwento-text-primary">
          Kwento
        </h1>

        {/* Tagline */}
        <p className="text-xl text-kwento-text-secondary">
          Get your stories out of your head.
        </p>

        {/* Description */}
        <p className="text-kwento-text-secondary leading-relaxed">
          An AI-powered story development workspace that helps you extract
          fragmented ideas, visualize your narrative, and write complete stories.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/workspace"
            className="px-6 py-3 bg-kwento-accent text-kwento-bg-primary font-semibold rounded-lg hover:bg-kwento-accent-secondary transition-colors"
          >
            New Story
          </Link>
          <Link
            href="/workspace"
            className="px-6 py-3 bg-kwento-bg-secondary text-kwento-text-primary font-semibold rounded-lg border border-kwento-bg-tertiary hover:bg-kwento-bg-tertiary transition-colors"
          >
            Continue Writing
          </Link>
        </div>

        {/* Status */}
        <p className="text-sm text-kwento-text-secondary pt-8">
          <span className="inline-block w-2 h-2 rounded-full bg-kwento-success mr-2"></span>
          Phase 1: Foundation Complete
        </p>
      </div>
    </main>
  )
}
