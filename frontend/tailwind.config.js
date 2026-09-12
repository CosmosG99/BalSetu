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
        // Bright Teal Brand Colors
        teal: {
          950: '#0A1815',
          900: '#0F1D19', // Dark mode background
          850: '#162722', // Dark mode surface
          800: '#136657',
          700: '#167A68', // Primary light mode brand
          600: '#1E9680',
          500: '#2B9A82', // Primary dark mode brand
          400: '#4AB59D',
          300: '#6ECBB5',
          200: '#8BCDB4', // Secondary mint
          100: '#D4F0E7',
          50: '#F0F9F6'
        },
        // Warm Ivory Background Colors
        ivory: {
          300: '#E2E5D8',
          200: '#ECEEE5',
          100: '#F7F8F4', // Light mode background
          50: '#FCFCF9'
        },
        // Charcoal Typography & Surface Colors
        charcoal: {
          950: '#0F1D19',
          900: '#162722',
          850: '#1B2E28',
          800: '#18332D', // Primary light text
          700: '#2C4A42',
          600: '#60736D', // Secondary light text
          500: '#7E918B',
          400: '#9DB0A8', // Dark mode muted text
          300: '#C2D1CB',
          200: '#DFE7E3',
          100: '#F5F4EE', // Dark mode text
          50: '#F7FAF9'
        },
        // Warm Coral Accents
        coral: {
          700: '#C75B42',
          600: '#E8785D', // Main warm coral
          500: '#F08E76',
          200: '#FAD5CB',
          100: '#FCECE8'
        },
        // Warm Amber Accents
        amberGold: {
          700: '#C5962B',
          600: '#E7B84B', // Warm golden yellow
          500: '#F2C663',
          200: '#F8E8C0',
          100: '#FAF3DF'
        },
        // Functional Badges & Statuses
        statusSuccess: '#2E9B72',
        statusWarning: '#D99A32',
        statusDanger: '#D95C55'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px 0 rgba(22, 122, 104, 0.05)',
        'card': '0 4px 20px -2px rgba(24, 51, 45, 0.06)',
        'modal': '0 16px 36px -8px rgba(15, 29, 25, 0.18)',
      }
    },
  },
  plugins: [],
}
