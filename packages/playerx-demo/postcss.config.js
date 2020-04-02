const purgecss = require('@fullhuman/postcss-purgecss');

const plugins = [
  require('postcss-import'),
  require('tailwindcss'),
  // require('postcss-comment'),
  // require('postcss-mixins'),
  // require('postcss-color-mix'),
];

if (process.env.NODE_ENV === 'prod') {
  plugins.push(
    purgecss({
      content: ['./src/**/*.{html,njk,md}'],
      extractors: [
        {
          extractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
          extensions: ['css', 'html', 'njk', 'md']
        }
      ]
    }),
    require('autoprefixer'),
    require('cssnano')
  );
}

module.exports = {
  plugins
};
