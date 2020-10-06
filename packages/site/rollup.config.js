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
    sequences: false, // caused an issue with Babel where sequence order was wrong
  }
});

const config = {
  input: 'src/js/index.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'public/js/playerx-demo.js',
    name: 'playerxDemo',
  },
  plugins: [
    bundleSize(),
    sourcemaps(),
    commonjs(),
    nodeResolve(),

    babel({
      babelHelpers: 'bundled',
      inputSourceMap: false,
      compact: false,
    }),

    terserPlugin
  ]
};

export default [
  config,
  {
    ...config,
    input: 'src/js/playerx-plugged.js',
    output: {
      ...config.output,
      file: 'public/js/playerx-plugged.js',
      name: 'playerx',
    },
  },
  {
    ...config,
    input: 'src/js/site.js',
    output: {
      ...config.output,
      file: 'public/js/site.js',
      name: 'site',
    },
  },
  {
    ...config,
    input: 'src/js/mux.js',
    output: {
      ...config.output,
      file: 'public/js/mux.js',
      name: 'muxLazy',
      globals: { 'playerx': 'playerx' },
    },
    external: ['playerx'],
  },
];
