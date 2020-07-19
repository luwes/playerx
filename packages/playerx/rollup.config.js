import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';

const production = !process.env.ROLLUP_WATCH;

const terserPlugin = terser({
  sourcemap: true,
  warnings: true,
  compress: {
    passes: 2,
    drop_console: production,
    sequences: false, // caused an issue with Babel where sequence order was wrong
  },
  mangle: {
    properties: {
      regex: /^_\w/
    }
  }
});

const config = {
  input: 'src/index.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'es',
    sourcemap: true,
    file: 'module/playerx.js',
  },
  plugins: [
    bundleSize(),
    sourcemaps(),
    nodeResolve(),
  ],
};

export default [
  config,
  production && {
    ...config,
    output: {
      ...config.output,
      file: 'module/playerx.min.js',
      format: 'es',
    },
    plugins: [
      ...config.plugins,
      terserPlugin,
    ]
  },
  production && {
    ...config,
    output: {
      ...config.output,
      file: 'dist/playerx.js',
      format: 'umd',
      name: 'playerx',
    },
    plugins: [
      ...config.plugins,
      babel({
        babelHelpers: 'bundled',
        inputSourceMap: false,
        compact: false,
      }),
      terserPlugin,
    ]
  },
  // polyfills shouldn't go through Babel.
  production && {
    ...config,
    context: 'window',
    input: 'polyfills/index.js',
    output: {
      ...config.output,
      file: 'dist/polyfills.js',
      format: 'iife'
    },
    plugins: [
      ...config.plugins,
      terserPlugin,
    ],
  },
  {
    ...config,
    context: 'window',
    input: 'polyfills/index.js',
    output: {
      ...config.output,
      file: 'module/polyfills.js',
      format: 'es'
    }
  },
].filter(Boolean);
