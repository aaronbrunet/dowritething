const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      teal: colors.teal,
      blue: colors.blue,
      purple: {
        50: '#f3e5f5',
        100: '#e1bee7',
        200: '#ce93d8',
        300: '#ba68c8',
        400: '#ab47bc',
        500: '#9c27b0',
        600: '#8e24aa',
        700: '#7b1fa2',
        800: '#6a1b9a',
        900: '#4a148c',
        'accent-100': '#ea80fc',
        'accent-200': '#e040fb',
        'accent-400': '#d500f9',
        'accent-700': '#aa00ff',
      },
      'deep-purple': {
        50: '#ede7f6',
        100: '#d1c4e9',
        200: '#b39ddb',
        300: '#9575cd',
        400: '#7e57c2',
        500: '#673ab7',
        600: '#5e35b1',
        700: '#512da8',
        800: '#4527a0',
        900: '#311b92',
        'accent-100': '#b388ff',
        'accent-200': '#7c4dff',
        'accent-400': '#651fff',
        'accent-700': '#6200ea',
      },
      'spring-wood': {
        '50': '#fffefe', 
        '100': '#fefefd', 
        '200': '#fdfcfb', 
        '300': '#fbfbf8', 
        '400': '#f8f7f3', 
        '500': '#f5f4ee', 
        '600': '#dddcd6', 
        '700': '#b8b7b3', 
        '800': '#93928f', 
        '900': '#787875'
      },
      
    },
    extend: {
      boxShadow: {
      outline: '0 0 0 3px rgba(101, 31, 255, 0.4)',
      },
    },
    
  },
  variants: {    
    extend: {
      scale: ['responsive', 'hover', 'focus', 'group-hover'],
      textColor: ['responsive', 'hover', 'focus', 'group-hover'],
      opacity: ['responsive', 'hover', 'focus', 'group-hover'],
      backgroundColor: ['responsive', 'hover', 'focus', 'group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
