/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Tokens resolve through CSS custom properties so every utility follows the theme.
      colors: {
        ground:  'var(--ground)',
        ink:     'var(--ink)',
        panel:   'var(--panel)',
        muted:   'var(--muted)',
        hairline: 'var(--hairline)',
        silver:  'var(--silver)',
        'inv-ground': 'var(--inv-ground)',
        'inv-ink':    'var(--inv-ink)',
        'inv-muted':  'var(--inv-muted)',
      },
      fontFamily: {
        sans: ['Archivo', 'Arial Narrow', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        shell: '1180px',
      },
    },
  },
  plugins: [],
}
