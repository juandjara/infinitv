const colors = require('tailwindcss/colors')

module.exports = {
  // purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      ...colors,
      transparent: 'transparent',
      current: 'currentColor',
      primary: colors.amber
    },
    extend: {
      gridTemplateColumns: {
        cards: 'repeat(auto-fill, minmax(20rem, 1fr))'
      }
    }
  },
  variants: {
    extend: {
      ringWidth: ['hover'],
      opacity: ['disabled'],
      height: ['group-hover']
    }
  },
  plugins: []
}
