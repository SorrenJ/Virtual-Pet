/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/routes/**.{html,js,jsx,ts,tsx}', './src/components/**.{html,js,jsx,ts,tsx}', '.src/app.js', '.src/index.js', '.src/index.css'],
  theme: {
    extend: {
      colors: {
        primary: '#1DA1F2', // Custom primary color
        secondary: '#14171A', // Custom secondary color
      },
      spacing: {
        '72': '18rem', // Custom spacing value
        '84': '21rem',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'], // Custom font
      },
  },
    extend: {},
  },
  plugins: [],
}

