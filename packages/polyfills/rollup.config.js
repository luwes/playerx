import nodeResolve from '@rollup/plugin-node-resolve';
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
  input: 'index.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'es',
    sourcemap: true,
    file: 'esm/polyfills.js',
  },
  plugins: [
    bundleSize(),
    sourcemaps(),
    nodeResolve(),
  ],
};

export default [
  // polyfills shouldn't go through Babel.
  config,
  production && Object.assign(config, {
    context: 'window',
    output: Object.assign(config.output, {
      file: 'umd/polyfills.js',
      format: 'umd'
    }),
    plugins: [].concat(config.plugins, [
      terserPlugin,
    ]),
  }),
].filter(Boolean);
