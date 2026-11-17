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
          bg: '#08070D',
          canvas: '#0D0C15',
          surface: '#141220',
          surfaceLight: '#1B182B',
          card: '#13111C',
          cardHover: '#1A1726',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          cardBorderHover: 'rgba(139, 92, 246, 0.45)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(139, 92, 246, 0.35)',
          primary: '#7C3AED',
          primaryLight: '#8B5CF6',
          primaryHover: '#6D28D9',
          primaryDark: '#4C1D95',
          mint: '#10B981',
          amber: '#F59E0B',
          amberHover: '#D97706',
          amberLight: '#FEF3C7',
          danger: '#EF4444',
          info: '#38BDF8',
          purple: '#8B5CF6',
          text: '#F9FAFB',
          textMuted: '#94A3B8',
          textSubtle: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 2px 10px -1px rgba(124, 58, 237, 0.35)',
        'glow': '0 0 25px -4px rgba(124, 58, 237, 0.45)',
        'glow-lg': '0 0 45px -8px rgba(124, 58, 237, 0.55)',
        'glow-purple': '0 0 30px -4px rgba(139, 92, 246, 0.45)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'device-frame': '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px -5px rgba(124, 58, 237, 0.2)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'card-hover': '0 18px 40px -12px rgba(124, 58, 237, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
        'inner-bevel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 0.8 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
