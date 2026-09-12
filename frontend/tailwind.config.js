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
        // Deep Natural Green Background & Surfaces
        forest: {
          950: '#071A16', // Primary dark background
          900: '#0D2420', // Secondary dark surface
          850: '#102A25', // Card dark surface
          800: '#153D35',
          700: '#1B4D43',
          600: '#236155'
        },
        // Primary Brand Teal
        teal: {
          950: '#061D1A',
          900: '#0A2B27',
          800: '#0E423B',
          700: '#149B84', // Primary brand teal
          600: '#19B394',
          500: '#26C7A7',
          400: '#63D5C0', // Light teal
          300: '#8CE3D2',
          200: '#B5EFE4',
          100: '#DCF7F2',
          50: '#F2FDFB'
        },
        // Rich Multi-Accent Palette
        accentBlue: '#4F7CFF',
        accentPurple: '#8B4DE8',
        accentViolet: '#6D5CE7',
        accentOrange: '#FF9D24',
        accentCoral: '#FF654A',
        accentPink: '#E85AA7',
        accentCyan: '#42C7D9',
        accentAmber: '#F4C95D',
        accentGreen: '#2E9B72',

        // Warm Light Mode Ivory
        ivory: {
          300: '#E6E4D8',
          200: '#EFECE2',
          100: '#F6F5EF', // Light mode background
          50: '#FAF9F5'
        },
        // Charcoal Typography & Surface Tokens
        charcoal: {
          950: '#071A16', // Dark mode background
          900: '#0D2420', // Dark mode surface
          850: '#102A25', // Dark mode card
          800: '#071A16', // Primary light text
          700: '#1B332E',
          600: '#60736D', // Muted light text
          500: '#7E9690', // Muted text
          400: '#7E9690',
          300: '#A9BBB6', // Secondary dark text
          200: '#D0DCD8',
          100: '#F5F7F6', // Primary dark text
          50: '#F7FAF9'
        },
        // Functional Badges
        coral: {
          700: '#E04E35',
          600: '#FF654A',
          500: '#FF7D66',
          100: '#FFEBE8'
        },
        amberGold: {
          700: '#D6A93E',
          600: '#F4C95D',
          500: '#F8D882',
          100: '#FEF8E8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px 0 rgba(20, 155, 132, 0.05)',
        'card': '0 4px 20px -2px rgba(7, 26, 22, 0.08)',
        'modal': '0 16px 36px -8px rgba(7, 26, 22, 0.35)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-slow-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(6px)' },
        },
        'float-delayed-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      animation: {
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'float-delayed': 'float-delayed 6s ease-in-out 1s infinite',
        'float-slow-reverse': 'float-slow-reverse 7s ease-in-out 0.5s infinite',
        'float-delayed-reverse': 'float-delayed-reverse 5.5s ease-in-out 1.5s infinite',
      },
    },
  },
  plugins: [],
}
