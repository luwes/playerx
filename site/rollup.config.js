import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';

const production = !process.env.ROLLUP_WATCH;

const terserPlugin = terser({
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
    nodeResolve(),

    babel({
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
    input: 'src/js/site.js',
    output: {
      ...config.output,
      file: 'public/js/site.js',
      name: 'site',
    },
  },
  {
    ...config,
    input: 'src/js/matrix.js',
    output: {
      ...config.output,
      file: 'public/js/matrix.js',
      name: 'matrix',
    },
  },
  // {
  //   ...config,
  //   input: 'src/js/compare.js',
  //   output: {
  //     ...config.output,
  //     file: 'public/js/compare.js',
  //     name: 'compare',
  //   }
  // },
  // {
  //   ...config,
  //   input: 'src/js/rendition-observer.js',
  //   output: {
  //     ...config.output,
  //     file: 'public/js/rendition-observer.js',
  //     name: 'renditionObserver',
  //   },
  // },
];
