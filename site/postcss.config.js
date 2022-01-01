const plugins = [
  require('postcss-import'),
  require('tailwindcss/nesting'),
  require('tailwindcss'),
  require('autoprefixer'),
  // require('postcss-comment'),
  // require('postcss-mixins'),
  // require('postcss-color-mix'),
];

if (process.env.NODE_ENV === 'prod') {
  plugins.push(require('cssnano'));
}

module.exports = {
  plugins,
};
