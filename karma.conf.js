const path = require('path');
const alias = require('@rollup/plugin-alias');
const { default: nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');
const { default: babel } = require('@rollup/plugin-babel');
const minimist = require('minimist');
const c = require('ansi-colors');
const argv = minimist(process.argv.slice(2));

var coverage = String(process.env.COVERAGE) === 'true',
  ci = String(process.env.CI).match(/^(1|true)$/gi),
  pullRequest = !String(process.env.TRAVIS_PULL_REQUEST).match(
    /^(0|false|undefined)$/gi
  ),
  masterBranch = String(process.env.TRAVIS_BRANCH).match(/^master$/gi),
  automate = ci && !pullRequest && masterBranch;

var sauceLabsLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10'
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10'
  },
  sl_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'macOS 10.13'
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10'
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    version: '11.0',
    platform: 'Windows 7'
  }
};

var localLaunchers = {
  ChromeNoSandboxHeadless: {
    base: 'Chrome',
    flags: [
      '--no-sandbox',
      // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
      '--headless',
      '--disable-gpu',
      '--disable-translate',
      '--disable-extensions',
      // Without a remote debugging port, Google Chrome exits immediately.
      '--remote-debugging-port=9333',
      // Removes that crazy long prefix HeadlessChrome 79.0.3945 (Mac OS X 10.15.2)
      // '--user-agent=',
      '--disable-web-security',
      '--autoplay-policy=no-user-gesture-required',
    ],
  },
};

module.exports = function (config) {
  config.set({
    browsers: automate
      ? Object.keys(sauceLabsLaunchers)
      : Object.keys(localLaunchers),

    customLaunchers: automate ? sauceLabsLaunchers : localLaunchers,

    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
    },

    // browserLogOptions: { terminal: true },
    // browserConsoleLogOptions: { terminal: true },
    browserConsoleLogOptions: {
      level: automate ? 'log' : 'warn', // Filter on warn messages.
      format: '%b %T: %m',
      terminal: true,
    },

    browserNoActivityTimeout: 60 * 60 * 1000,

    // Especially on services like SauceLabs and Browserstack, it makes sense only to launch a limited amount of browsers at once, and only start more when those have finished. Using this configuration, you can specify how many browsers should be running at once at any given point in time.
    concurrency: Infinity,

    // The captureTimeout value represents the maximum boot-up time allowed for a browser to start and connect to Karma. If any browser does not get captured within the timeout, Karma will kill it and try to launch it again and, after three attempts to capture it, Karma will give up.
    captureTimeout: 60000,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,

    client: { captureConsole: !!argv.console },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['tap-pretty'].concat(
      coverage ? 'coverage' : []
      // automate ? 'saucelabs' : []
    ),

    tapReporter: {
      prettify: require('faucet'), // require('tap-spec')
    },

    formatError(msg) {
      msg = msg.replace(/\([^<]+/gm, '');
      msg = msg.replace(/(\bat\s.*)/gms, argv.stack ? c.dim('$1') : '');
      return msg;
    },

    coverageReporter: {
      dir: path.join(__dirname, 'coverage'),
      reporters: [
        { type: 'text' },
        { type: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' },
      ],
    },

    frameworks: ['tap'],

    files: [
      'https://unpkg.com/ua-parser-js@0.7.21/dist/ua-parser.min.js',
      'https://polyfill.io/v3/polyfill.min.js?features=Array.from%2CCustomEvent%2Cfetch%2CPromise',
      'https://unpkg.com/@webcomponents/custom-elements',
      'https://unpkg.com/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      {
        pattern: 'packages/playerx-demo/src/_data/dev/players.yaml',
        included: false,
        served: true
      },
      // {
      //   pattern: config.grep || 'packages/playerx/test/test.js',
      //   watched: false
      // },
      {
        pattern: 'packages/playerx/test/test.js',
        watched: false,
      },
    ],

    preprocessors: {
      'packages/playerx*/**/test.js': ['rollup'],
    },

    rollupPreprocessor: {
      output: {
        format: 'iife', // Helps prevent naming collisions.
        name: 'playerxTest', // Required for 'iife' format.
        sourcemap: 'inline', // Sensible for testing.
      },
      preserveSymlinks: true,
      plugins: [
        alias({
          entries: {
            tape: 'tape-browser',
            playerx: __dirname + '/packages/playerx/src/index.js',
          },
        }),
        nodeResolve(),
        commonjs(),
        istanbul({
          include: config.grep
            ? config.grep.replace('/test/', '/src/')
            : 'packages/**/src/**/*.js',
          exclude: [
            'packages/playerx/src/constants/events.js',
            'packages/playerx/src/players/index.js',
          ],
        }),
        babel({
          babelHelpers: 'bundled',
          inputSourceMap: false,
          compact: false,
        }),
      ].filter(Boolean),
      onwarn: (msg) => /eval/.test(msg) && void 0,
    },
  });
};
