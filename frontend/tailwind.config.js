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
        forest: {
          950: '#0F2922',
          900: '#173C32',
          800: '#1F4D41',
          700: '#2A6354',
          600: '#387B6A',
          500: '#4A9482',
          200: '#BFDDD6',
          100: '#E8F0EC',
          50: '#F2F7F4'
        },
        sage: {
          700: '#5C7A66',
          600: '#6F8F7A',
          500: '#7E9E89',
          300: '#A9C4B3',
          200: '#CBE0D3',
          100: '#E7F2EB',
          50: '#F3F8F5'
        },
        ivory: {
          200: '#EBE7DD',
          100: '#F5F3ED',
          50: '#FAF8F5'
        },
        charcoal: {
          950: '#101B18',
          900: '#162620',
          850: '#1A2E27',
          800: '#1E2925',
          700: '#2D3B36',
          600: '#465550',
          500: '#66736D',
          400: '#8A9B93',
          200: '#C7D4CE',
          100: '#E4ECE8',
          50: '#F4F7F6'
        },
        terracotta: {
          700: '#B06341',
          600: '#C97955',
          500: '#D98965',
          200: '#F3CBB8',
          100: '#FBECE5',
          50: '#FDF5F1'
        },
        amberGold: {
          700: '#B88732',
          600: '#D6A64F',
          500: '#E4B65F',
          200: '#F5E2B8',
          100: '#FBF3E2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px 0 rgba(23, 60, 50, 0.06)',
        'card': '0 4px 20px -2px rgba(23, 60, 50, 0.08)',
        'modal': '0 20px 40px -10px rgba(16, 27, 24, 0.25)',
      }
    },
  },
  plugins: [],
}
