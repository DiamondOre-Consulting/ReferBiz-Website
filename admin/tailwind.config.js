/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: '#140A64',
        light: '#2C56FF',
        borderDark: '#323A49',
        grayText: '#B2B3B7',
        dashRed: '#D24C4C',
        white: '#ffffff',  // Standard white color
        black: '#000000',  // Standard black color
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}