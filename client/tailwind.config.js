/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        main: '#140A64',
        light: '#2C56FF',
        white: '#ffffff',  // Standard white color
        black: '#000000',  // Standard black color
      },
    },
  },
  plugins: [],
}