/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // <--- ¡ESTA ES LA LÍNEA MÁGICA! 
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B1120',
          gold: '#00F0FF', // Cian Eléctrico
          light: '#1E293B',
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'circuit-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
      }
    },
  },
  plugins: [],
}