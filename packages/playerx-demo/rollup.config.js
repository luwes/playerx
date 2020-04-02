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
  input: 'src/demo.js',
  watch: {
    clearScreen: false
  },
  output: {
    format: 'iife',
    sourcemap: true,
    file: 'dist/demo.js',
    name: 'playerxDemo'
  },
  plugins: [
    bundleSize(),
    nodeResolve(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terserPlugin
  ]
};

export default [
  {
    ...config,
    output: {
      ...config.output,
      file: 'module/playerx-demo.js',
      format: 'es'
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      file: 'dist/playerx-demo.js',
      format: 'umd'
    },
    plugins: [
      ...config.plugins,
      babel(),
    ]
  }
];
