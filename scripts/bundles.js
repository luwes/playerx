export const IIFE = 'iife';
export const CJS = 'cjs';
export const ESM = 'esm';
export const UMD = 'umd';

export const bundleFormats = {
  ESM,
  UMD
};

const dest = (path = '') => (format) => {
  return `packages/playerx/${format === ESM ? 'module' : 'dist'}${path}`;
};

export const bundles = [
  // `htm` has to come before `babel-plugin-htm`
  {
    external: [],
    formats: [ESM, UMD, IIFE],
    global: 'playerx',
    name: 'playerx',
    input: 'packages/playerx/src/index.js',
    dest: dest(),
    sourcemap: true,
    babel: {
      // plugins: ['sinuous/babel-plugin-htm']
    }
  }
];

export const fixtures = [
];
