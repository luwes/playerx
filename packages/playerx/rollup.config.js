import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';

const production = !process.env.ROLLUP_WATCH;

const terserPlugin = terser({
  sourcemap: true,
  warnings: true,
  compress: {
    passes: 2
  },
  mangle: {
    properties: {
      regex: /^_/
    }
  }
});

const config = {
  input: 'src/index.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'dist/playerx.js',
    name: 'playerx'
  },
  plugins: [
    bundleSize(),
    nodeResolve(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    terserPlugin
  ]
};

export default [
  {
    ...config,
    output: {
      ...config.output,
      file: 'module/playerx.js',
      format: 'es'
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      file: 'dist/playerx.js',
      format: 'umd'
    },
    plugins: [
      ...config.plugins,
      babel()
    ]
  }
];
