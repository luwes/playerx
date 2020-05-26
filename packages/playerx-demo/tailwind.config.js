const ui = require('@tailwindcss/ui');
const colors = require('@tailwindcss/ui/colors');
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  plugins: [
    ui,
  ],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: [
        'Inter',
        ...fontFamily.sans
      ],
    },
    colors: {
      ...colors,

      aquamarine: {
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
      },

      // aquamarine: {
      //   50: '#edfff8',
      //   100: '#d9fff2',
      //   200: '#c5feeb',
      //   300: '#b0fee5',
      //   400: '#99fdde',
      //   500: '#7ffcd8',
      //   600: '#6acdb0',
      //   700: '#55a08a',
      //   800: '#417666',
      //   900: '#1b2924',
      // },
    },
  }
};
