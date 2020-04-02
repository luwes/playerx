import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';

const production = !process.env.ROLLUP_WATCH;

const terserPlugin = terser({
  sourcemap: true,
  warnings: true,
  compress: {
    passes: 2,
    sequences: false, // caused an issue with Babel where sequence order was wrong
  }
});

const config = {
  input: 'src/demo.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'dist/playerx-demo.js',
    name: 'playerxDemo',
    strict: false, // Remove `use strict;`
    interop: false, // Remove `r=r&&r.hasOwnProperty("default")?r.default:r;`
    freeze: false, // Remove `Object.freeze()`
    esModule: false // Remove `esModule` property
  },
  plugins: [
    bundleSize(),
    sourcemaps(),
    nodeResolve(),
    babel({
      inputSourceMap: false,
      compact: false,
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    terserPlugin
  ]
};

export default [
  config,
  {
    ...config,
    input: 'src/playerx-plugged.js',
    output: {
      ...config.output,
      file: 'dist/playerx-plugged.js',
      name: 'playerxPlugged',
    },
  },
];
