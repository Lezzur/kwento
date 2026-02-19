import type { Metadata } from 'next'
import { Inter, Caveat } from 'next/font/google'
import './globals.css'
import { ToastContainer } from '@/components/ui/Toast'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' })

export const metadata: Metadata = {
  metadataBase: new URL('https://kwento-five.vercel.app'),
  title: 'Kwento - Get your stories out of your head',
  description: 'AI-powered story development workspace that helps writers extract ideas and create complete stories.',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    title: 'Kwento - Get your stories out of your head',
    description: 'AI-powered story development workspace that helps writers extract ideas and create complete stories.',
    siteName: 'Kwento',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kwento - AI Story Development Workspace' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kwento - Get your stories out of your head',
    description: 'AI-powered story development workspace that helps writers extract ideas and create complete stories.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${caveat.variable}`}>
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
