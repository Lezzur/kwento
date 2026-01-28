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
        // Dark mode (default) - Cozy/Warm palette
        kwento: {
          // Backgrounds
          'bg-primary': '#1C1917',      // Warm charcoal
          'bg-secondary': '#292524',    // Warm dark gray
          'bg-tertiary': '#44403C',     // Stone

          // Text
          'text-primary': '#FAFAF9',    // Warm white
          'text-secondary': '#A8A29E',  // Stone gray

          // Accents
          'accent': '#F59E0B',          // Amber gold
          'accent-secondary': '#EA580C', // Terracotta

          // Status
          'success': '#84CC16',         // Sage green
          'warning': '#FACC15',         // Warm yellow
          'error': '#EF4444',           // Soft red

          // Light mode variants
          'light-bg': '#FFFBEB',        // Warm cream
          'light-surface': '#FEFCE8',   // Soft white
          'light-accent': '#D97706',    // Deep amber
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
