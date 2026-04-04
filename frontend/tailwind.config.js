/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      colors: {
        cream: '#f5f2ec',
        ivory: '#faf8f4',
        charcoal: '#1a1a18',
        stone: '#8a8880',
        silk: '#e8e4dc',
      },
    },
  },
  plugins: [],
};