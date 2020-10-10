import fs from 'fs';
import path from 'path';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import bundleSize from 'rollup-plugin-size';
import sourcemaps from 'rollup-plugin-sourcemaps';
import virtual from '@rollup/plugin-virtual';

const production = !process.env.ROLLUP_WATCH;

let bundles = [
  ...createBundles('src/index.js', 'playerx', 'playerx'),
  ...createBundles('src/all.js', 'all', 'plxAll'),
];

const players = fs.readdirSync('src/players');
players.forEach((player) => {
  player = path.basename(player, '.js');
  const globalName = `plx${player[0].toUpperCase()}${player.slice(1)}`;
  bundles = [
    ...bundles,
    ...createBundles('entry', player, globalName, [
      virtual({
        entry: `
import { options } from 'playerx';
import { canPlay } from './src/players/${player}.js';
options.players.${player} = {
  canPlay,
  lazyPlayer: () => import('./src/players/${player}.js'),
};
        `
      })
    ]),
  ];
});

export default bundles.filter(Boolean);

function createBundles(input, outputName, globalName, plugins = []) {
  const config = {
    input,
    watch: {
      clearScreen: false,
    },
    output: {
      format: 'es',
      sourcemap: true,
      file: `esm/${outputName}.js`,
      globals: { playerx: 'playerx' },
      inlineDynamicImports: true, // set to true for now
      strict:   false, // Remove `use strict;`
      interop:  false, // Remove `r=r&&r.hasOwnProperty("default")?r.default:r;`
      freeze:   false, // Remove `Object.freeze()`
      esModule: false, // Remove `esModule` property
    },
    external: ['playerx'],
    plugins: [...plugins, bundleSize(), sourcemaps(), nodeResolve()],
  };

  return [
    config,
    production && {
      ...config,
      output: {
        ...config.output,
        file: `esm/${outputName}.min.js`,
        format: 'es',
      },
      plugins: [...config.plugins, pluginTerser()],
    },
    production && {
      ...config,
      output: {
        ...config.output,
        file: `umd/${outputName}.js`,
        format: 'umd',
        name: globalName,
      },
      plugins: [
        ...config.plugins,
        babel({
          babelHelpers: 'bundled',
          inputSourceMap: false,
          compact: false,
        }),
        pluginTerser(),
      ],
    },
  ];
}

/** @type {() => Plugin} */
function pluginTerser() {
  return terser({
    sourcemap: true,
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
