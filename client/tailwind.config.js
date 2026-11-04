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
          bg: '#F8FAFC',
          canvas: '#FFFFFF',
          surface: '#F1F5F9',
          surfaceLight: '#F8FAFC',
          card: '#FFFFFF',
          cardHover: '#F8FAFC',
          cardBorder: '#E2E8F0',
          cardBorderHover: 'rgba(56, 126, 209, 0.45)',
          border: '#E2E8F0',
          borderGlow: 'rgba(56, 126, 209, 0.35)',
          primary: '#387ED1',
          primaryLight: '#EBF3FC',
          primaryHover: '#2B6EB8',
          primaryDark: '#1D4B85',
          mint: '#10B981',
          amber: '#F97316',
          amberHover: '#EA580C',
          amberLight: '#FFF7ED',
          danger: '#DF514C',
          info: '#0284C7',
          purple: '#8B5CF6',
          text: '#1E293B',
          textMuted: '#64748B',
          textSubtle: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace']
      },
      boxShadow: {
        'glow-sm': '0 2px 8px -1px rgba(56, 126, 209, 0.25)',
        'glow': '0 4px 14px -2px rgba(56, 126, 209, 0.35)',
        'glow-lg': '0 10px 25px -4px rgba(56, 126, 209, 0.3)',
        'glow-amber': '0 4px 14px -2px rgba(249, 115, 22, 0.35)',
        'glow-cyan': '0 4px 14px -2px rgba(2, 132, 199, 0.35)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(56, 126, 209, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
        'glass': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'glass-card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'inner-bevel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
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
