import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';

const production = !process.env.ROLLUP_WATCH;

const config = {
  input: 'src/preview.js',
  watch: {
    clearScreen: false,
  },
  output: {
    format: 'es',
    sourcemap: production,
    file: 'dist/preview.js',
    globals: { playerx: 'playerx' },
  },
  external: ['playerx'],
  plugins: [bundleSize(), sourcemaps(), nodeResolve()],
};

export default [
  config,
  production && {
    ...config,
    output: {
      ...config.output,
      file: `dist/preview.min.js`,
    },
    plugins: [...config.plugins, pluginTerser()],
  },
  {
    ...config,
    output: {
      ...config.output,
      format: 'umd',
      sourcemap: true,
      file: 'dist/preview.umd.js',
      name: 'plxPreview',
    },
    plugins: [
      ...config.plugins,
      babel({
        babelHelpers: 'bundled',
        include: '**/*',
        inputSourceMap: false,
        compact: false,
      }),
      production && pluginTerser(),
    ].filter(Boolean),
  },
].filter(Boolean);

/** @type {() => Plugin} */
function pluginTerser() {
  return terser({
    warnings: true,
    compress: {
      passes: 2,
      drop_console: production,
      sequences: false, // caused an issue with Babel where sequence order was wrong
    },
    mangle: {
      properties: {
        regex: /^_\w/,
      },
    },
  });
}
