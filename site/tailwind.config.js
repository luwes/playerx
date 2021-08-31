const ui = require('@tailwindcss/ui');
const { variants } = require('tailwindcss/defaultConfig');
const { fontFamily } = require('tailwindcss/defaultTheme');

const aquamarine = {
  50: '#E9FCF7',
  100: '#CBF8EC',
  200: '#9DF3DB',
  300: '#8EF1D5',
  400: '#70EDCA',
  500: '#4ADEC0',
  600: '#18BD9F',
  700: '#129083',
  800: '#0B544E',
  900: '#073628',
};

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'prod',
    mode: 'layers',
    layers: ['base', 'components', 'utilities'],
    content: ['./src/**/*.{html,njk,md,js}']
  },
  plugins: [
    ui,
  ],
  variants: {
    opacity: [...variants.opacity, 'disabled'],
    cursor: [...variants.cursor, 'disabled'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
        source: ['Source Sans Pro', ...fontFamily.sans],
        system: fontFamily.sans,
      },
      colors: {
        aquamarine
      },
      width: {
        '1/9': '11.111111111%',
        '2/9': '22.222222222%',
        '3/9': '33.333333333%',
        '4/9': '44.444444444%',
        '5/9': '55.555555556%',
        '6/9': '66.666666667%',
        '7/9': '77.777777778%',
        '8/9': '88.888888889%',
      },
      inset: {
        '-4': '-1rem',
        '-6': '-1.5rem',
        '-8': '-2rem',
        '-12': '-3rem',
      }
    }
  }
};
