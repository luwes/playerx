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
  // mangle: {
  //   properties: {
  //     regex: /^_\w/
  //   }
  // }
});

const config = {
  input: 'src/mux.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'dist/playerx-mux.js',
    name: 'plxMux',
    globals: { playerx: 'playerx' },
  },
  external: ['playerx'],
  plugins: [
    bundleSize(),
    sourcemaps(),
    commonjs(),
    nodeResolve(),

    production && terserPlugin
  ]
};

export default [
  {
    ...config,
    output: {
      ...config.output,
      file: 'module/playerx-mux.js',
      format: 'es'
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      file: 'dist/playerx-mux.js',
      format: 'umd'
    },
    plugins: [
      ...config.plugins,
      production && babel({
        babelHelpers: 'bundled',
        inputSourceMap: false,
        compact: false,
      })
    ]
  },
];
