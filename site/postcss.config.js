const plugins = [
  require('postcss-import'),
  require('tailwindcss/nesting'),
  require('tailwindcss'),
];

if (process.env.NODE_ENV === 'prod') {
  plugins.push(require('cssnano'));
}

module.exports = {
  plugins,
};
