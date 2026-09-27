/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        thai: ['Sarabun', 'sans-serif'],
        code: ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
