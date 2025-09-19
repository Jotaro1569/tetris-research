/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#121212',
        'dark-light': '#1a1a1a',
        'gold': '#FFD700',
        'gold-light': '#FFDF4F',
        'gold-dark': '#B8860B',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #FFDF4F 100%)',
        'dark-gradient': 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
} 