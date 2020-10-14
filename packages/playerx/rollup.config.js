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
  // ...createBundles('src/all.js', 'lazy', 'playerx', [], false),
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
import { ${player} } from './src/canplay.js';
options.players.${player} = {
  canPlay: ${player},
  lazyPlayer: () => import('./src/players/${player}.js'),
};
        `,
      }),
    ]),
  ];
});

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
      sourcemap: true,
      file: `esm/${outputName}.js`,
      globals: { playerx: 'playerx' },
      inlineDynamicImports,
    },
    external: ['playerx'],
    plugins: [...plugins, bundleSize(), sourcemaps(), nodeResolve()],
  };

  if (inlineDynamicImports === false) {
    delete config.output.file;
    config.output.dir = 'esm';
    config.output.entryFileNames = 'lazy.js';
    config.output.chunkFileNames = (chunkInfo) => {
      return `lazy-${chunkInfo.name}.js`;
    };
  }

  return [
    config,
    {
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
