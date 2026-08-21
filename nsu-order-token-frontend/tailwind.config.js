/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F4EF',
        ink: '#20262A',
        teal: {
          DEFAULT: '#0F5257',
          dark: '#0A3B3F',
          light: '#DCEAE9',
        },
        marigold: {
          DEFAULT: '#E8A33D',
          dark: '#C7822A',
          light: '#FBEAD1',
        },
        clay: {
          DEFAULT: '#C1533D',
          light: '#F5DAD3',
        },
        line: '#DBD7CC',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
