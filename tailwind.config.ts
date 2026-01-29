import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic theme colors using CSS variables
        kwento: {
          // Backgrounds
          'bg-primary': 'rgb(var(--bg-primary-rgb) / <alpha-value>)',
          'bg-secondary': 'rgb(var(--bg-secondary-rgb) / <alpha-value>)',
          'bg-tertiary': 'rgb(var(--bg-tertiary-rgb) / <alpha-value>)',

          // Text
          'text-primary': 'rgb(var(--text-primary-rgb) / <alpha-value>)',
          'text-secondary': 'rgb(var(--text-secondary-rgb) / <alpha-value>)',

          // Accents
          'accent': 'rgb(var(--accent-rgb) / <alpha-value>)',
          'accent-secondary': 'rgb(var(--accent-secondary-rgb) / <alpha-value>)',

          // Status
          'success': 'rgb(var(--success-rgb) / <alpha-value>)',
          'warning': 'rgb(var(--warning-rgb) / <alpha-value>)',
          'error': 'rgb(var(--error-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.2s ease-out',
        'slide-out': 'slide-out 0.2s ease-in',
      },
    },
  },
  plugins: [],
}

export default config
