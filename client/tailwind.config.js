/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        campus: {
          bg: '#080D0C',
          surface: '#0E1715',
          card: '#131F1C',
          cardHover: '#182824',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(16, 185, 129, 0.3)',
          primary: '#10B981',
          primaryHover: '#059669',
          mint: '#34D399',
          amber: '#F59E0B',
          amberHover: '#D97706',
          danger: '#EF4444',
          info: '#38BDF8',
          text: '#F9FAFB',
          textMuted: '#9CA3AF',
          textSubtle: '#6B7280'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace']
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}

