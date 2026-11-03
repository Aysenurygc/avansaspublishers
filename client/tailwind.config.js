/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf6ee',
          100: '#faebd7',
          200: '#f4d4ae',
          300: '#ecb87d',
          400: '#e2934a',
          500: '#d97328',
          600: '#ca5d1e',
          700: '#a8461b',
          800: '#87391d',
          900: '#6e301a',
          950: '#3b170b',
        },
        gold: {
          400: '#f0c040',
          500: '#d4a017',
          600: '#b8860b',
        },
        dark: {
          900: '#0f0d0a',
          800: '#1a1510',
          700: '#241e16',
          600: '#2e271c',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-in-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' },                    '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
