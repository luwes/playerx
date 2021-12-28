import fs from 'fs';
import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';
import virtual from '@rollup/plugin-virtual';
import json from '@rollup/plugin-json';

const production = !process.env.ROLLUP_WATCH;

let bundles = [
  ...createBundles('src/config/index.js', 'config', 'plxConfig'),
  ...createBundles('src/playerx/index.js', 'playerx', 'playerx'),
  ...createBundles('src/playerx/all.js', 'all', 'plxAll'),
  // ...createBundles('src/all.js', 'lazy', 'playerx', [], false),
  ...createBundles('src/controls/index.js', 'controls', 'plxControls'),
  ...createBundles('src/mux/mux.js', 'mux', 'plxMUX'),
  ...createBundles('src/preview/preview.js', 'preview', 'plxPreview'),
  ...createBundles('src/schema/schema.js', 'schema', 'plxSchema'),
  ...createBundles('src/polyfills/polyfills.js', 'polyfills', 'plxPolyfills'),
];

if (production) {
  const players = fs.readdirSync('src/playerx/players');
  players.forEach((player) => {
    player = path.basename(player, '.js');

    const globalName = `plx${player[0].toUpperCase()}${player.slice(1)}`;
    bundles = [
      ...bundles,
      ...createBundles('entry', player, globalName, [
        virtual({
          entry: `
  import { options } from 'playerx';
  import { ${player} } from './src/playerx/canplay.js';
  options.players.${player} = {
    canPlay: ${player},
    lazyPlayer: () => import('./src/playerx/players/${player}.js'),
  };
          `,
        }),
      ]),
    ];
  });
}

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
        babel({
          babelHelpers: 'bundled',
          inputSourceMap: false,
          compact: false,
        }),
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
