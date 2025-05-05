import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class', // ✅ Not "media"
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config