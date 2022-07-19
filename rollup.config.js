import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';
import json from '@rollup/plugin-json';

const production = !process.env.ROLLUP_WATCH;

let bundles = [
  ...createBundles('src/config/index.js', 'config', 'plxConfig'),
  ...createBundles('src/playerx/index.js', 'playerx', 'playerx'),
];

export default bundles.filter(Boolean);

function createBundles(
  input,
  outputName,
  globalName,
  plugins = [],
  inlineDynamicImports = true
) {
  const config = {
    input,
    watch: {
      clearScreen: false,
    },
    output: {
      format: 'es',
      sourcemap: production,
      file: `dist/${outputName}.js`,
      globals: { playerx: 'playerx' },
      inlineDynamicImports,
    },
    external: ['playerx'],
    plugins: [
      ...plugins,
      bundleSize(),
      sourcemaps(),
      commonjs(),
      nodeResolve(),
      json(),
    ],
  };

  if (inlineDynamicImports === false) {
    delete config.output.file;
    config.output.dir = 'dist';
    config.output.entryFileNames = 'lazy.js';
    config.output.chunkFileNames = (chunkInfo) => {
      return `lazy-${chunkInfo.name}.js`;
    };
  }

  return [
    config,
    production && {
      ...config,
      output: {
        ...config.output,
        file: `dist/${outputName}.min.js`,
      },
      plugins: [...config.plugins, pluginTerser()],
    },
    {
      ...config,
      output: {
        ...config.output,
        format: 'umd',
        sourcemap: true,
        file: `dist/${outputName}.umd.js`,
        name: globalName,
      },
      plugins: [
        ...config.plugins,
        production && pluginTerser(),
      ].filter(Boolean),
    },
  ];
}

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
