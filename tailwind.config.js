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
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-magenta': '0 0 25px -5px rgba(217, 70, 239, 0.3)',
        'glow-critical': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to right bottom, rgba(15, 23, 42, 0.9), rgba(8, 12, 20, 0.95))',
      }
    },
  },
  plugins: [],
}
