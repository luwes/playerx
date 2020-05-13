import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';

// const production = !process.env.ROLLUP_WATCH;

const terserPlugin = terser({
  sourcemap: true,
  warnings: true,
  compress: {
    passes: 2
  },
  // mangle: {
  //   properties: {
  //     regex: /^_\w/
  //   }
  // }
});

const config = {
  input: 'src/lite.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'dist/playerx-lite.js',
    name: 'plxLite',
    globals: { playerx: 'playerx' },
  },
  external: ['playerx'],
  plugins: [
    bundleSize(),
    nodeResolve(),
    terserPlugin
  ]
};

export default [
  {
    ...config,
    output: {
      ...config.output,
      file: 'module/playerx-lite.js',
      format: 'es'
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      file: 'dist/playerx-lite.js',
      format: 'umd'
    },
    plugins: [
      ...config.plugins,
      babel({
        babelHelpers: 'bundled'
      })
    ]
  },
];
