import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
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
  },
  mangle: {
    properties: {
      regex: /^_\w/
    }
  }
});

const config = {
  input: 'src/mux.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'es',
    sourcemap: true,
    file: 'esm/mux.js',
    globals: { '@playerx/player': 'playerx' },
  },
  external: ['@playerx/player'],
  plugins: [
    bundleSize(),
    sourcemaps(),
    commonjs(),
    nodeResolve(),
  ]
};

export default [
  config,
  production && {
    ...config,
    output: {
      ...config.output,
      file: 'esm/mux.min.js',
      format: 'es'
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
      file: 'umd/mux.js',
      format: 'umd',
      name: 'plxMux',
    },
    plugins: [
      ...config.plugins,
      production && babel({
        babelHelpers: 'bundled',
        inputSourceMap: false,
        compact: false,
      }),
      terserPlugin,
    ]
  },
].filter(Boolean);
