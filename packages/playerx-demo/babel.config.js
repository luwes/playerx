/* eslint-env node */
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: false,
        targets: {
          browsers: ['ie >= 11']
        }
      }
    ]
  ],
  plugins: [
    ['sinuous/babel-plugin-htm', {
      import: 'sinuous/hydrate',
      pragma: 'd',
      tag: 'dhtml'
    }, 'for hydrate'],
    ['sinuous/babel-plugin-htm', {
      import: 'sinuous'
    }],
    ['babel-plugin-transform-async-to-promises', {
      inlineHelpers: true
    }]
  ],
};
