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
        brand: {
          dark: '#080C14',
          navy: '#0F172A',
          card: '#161F32',
          surface: '#1E293B',
          purple: '#8B5CF6',
          magenta: '#D946EF',
          lavender: '#E9D5FF',
          accent: '#A855F7',
          amber: '#F59E0B',
          critical: '#EF4444',
          success: '#10B981',
          info: '#3B82F6',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 30px -5px rgba(139, 92, 246, 0.35)',
        'glow-magenta': '0 0 30px -5px rgba(217, 70, 239, 0.35)',
        'glow-critical': '0 0 30px -5px rgba(239, 68, 68, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to right bottom, rgba(15, 23, 42, 0.9), rgba(8, 12, 20, 0.95))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}
