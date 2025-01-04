/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'nueue' : ['Nueue', 'sans-serif'],
        'grotesk': ['Grotesk', 'sans-serif'],
        'icomoon': ['icomoon', 'sans-serif'],
      }
    },
  },
  plugins: [],
}