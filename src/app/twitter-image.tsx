import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Kwento - AI Story Development Workspace'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#e2b714"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          width="80"
          height="80"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <path d="M8 7h8" />
          <path d="M8 11h6" />
        </svg>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#ffffff',
            marginTop: 24,
          }}
        >
          Kwento
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#e2b714',
            marginTop: 12,
          }}
        >
          Get your stories out of your head.
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#a0a0b0',
            marginTop: 16,
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          AI-powered story development workspace
        </div>
      </div>
    ),
    { ...size }
  )
}
