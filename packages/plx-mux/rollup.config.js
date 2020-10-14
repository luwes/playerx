import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';

const production = !process.env.ROLLUP_WATCH;

const terserPlugin = terser({
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
    globals: { 'playerx': 'playerx' },
  },
  external: ['playerx'],
  plugins: [
    bundleSize(),
    sourcemaps(),
    commonjs(),
    nodeResolve(),
  ]
};

export default [
  config,
  {
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
      production && terserPlugin,
    ].filter(Boolean),
  },
].filter(Boolean);
