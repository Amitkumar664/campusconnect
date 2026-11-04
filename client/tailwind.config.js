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
          bg: '#070A09',
          canvas: '#090E0C',
          surface: '#0F1614',
          surfaceLight: '#141E1B',
          card: '#121C19',
          cardHover: '#182622',
          cardBorder: 'rgba(255, 255, 255, 0.08)',
          cardBorderHover: 'rgba(16, 185, 129, 0.35)',
          border: 'rgba(255, 255, 255, 0.08)',
          borderGlow: 'rgba(16, 185, 129, 0.35)',
          primary: '#10B981',
          primaryLight: '#34D399',
          primaryHover: '#059669',
          primaryDark: '#064E3B',
          mint: '#2DD4BF',
          amber: '#F59E0B',
          amberHover: '#D97706',
          amberLight: '#FBBF24',
          danger: '#EF4444',
          info: '#38BDF8',
          purple: '#A855F7',
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
        'glow-sm': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'glow': '0 0 25px -4px rgba(16, 185, 129, 0.35)',
        'glow-lg': '0 0 45px -8px rgba(16, 185, 129, 0.45)',
        'glow-amber': '0 0 25px -4px rgba(245, 158, 11, 0.35)',
        'glow-cyan': '0 0 25px -4px rgba(56, 189, 248, 0.35)',
        'glass': '0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-card': '0 12px 35px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'inner-bevel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12)'
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'float': 'float 5s ease-in-out infinite',
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
