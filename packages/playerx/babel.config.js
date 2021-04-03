/* eslint-env node */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        targets: {
          browsers: ['ie >= 11'],
        },
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-classes',
      {
        // must be false for custom elements to work in modern browsers with es5
        loose: false,
      },
    ],
    [
      'babel-plugin-transform-async-to-promises',
      {
        inlineHelpers: true,
      },
    ],
  ],
};
