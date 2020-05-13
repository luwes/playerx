const path = require('path');
const alias = require('@rollup/plugin-alias');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const istanbul = require('rollup-plugin-istanbul');
const babel = require('@rollup/plugin-babel');
const minimist = require('minimist');
const c = require('ansi-colors');
const argv = minimist(process.argv.slice(2));

var coverage = String(process.env.COVERAGE) === 'true',
  ci = String(process.env.CI).match(/^(1|true)$/gi),
  pullRequest = !String(process.env.TRAVIS_PULL_REQUEST).match(/^(0|false|undefined)$/gi),
  masterBranch = String(process.env.TRAVIS_BRANCH).match(/^master$/gi),
  automate = ci && !pullRequest && masterBranch;

var browserstackLaunchers = {
  bs_chrome_win: {
    base: 'BrowserStack',
    browser: 'Chrome',
    browser_version: '80.0',
    os: 'Windows',
    os_version: '10',
    chromeOptions: {
      args: [
        '--disable-web-security',
        '--autoplay-policy=no-user-gesture-required'
      ]
    }
  },
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
      '--user-agent=',
      '--disable-web-security',
      '--autoplay-policy=no-user-gesture-required',
    ]
  }
};

module.exports = function(config) {
  config.set({
    browsers: automate
      ? Object.keys(browserstackLaunchers)
      : Object.keys(localLaunchers),

    customLaunchers: automate ? browserstackLaunchers : localLaunchers,

    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_ACCESS_KEY
    },

    sauceLabs: {
      build: 'CI #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER || ('local'+require('./package.json').version),
      connectLocationForSERelay: 'localhost',
      connectPortForSERelay: 4445,
      startConnect: false
    },

    // browserLogOptions: { terminal: true },
    // browserConsoleLogOptions: { terminal: true },
    browserConsoleLogOptions: {
      level: 'warn', // Filter on warn messages.
      format: '%b %T: %m',
      terminal: true
    },

    browserNoActivityTimeout: 60 * 60 * 1000,

    // Use only one browser, works better with open source Sauce Labs remote testing
    concurrency: 2,

    captureTimeout: 0,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,

    client: { captureConsole: !!argv.console },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['tap-pretty'].concat(
      coverage ? 'coverage' : [],
      automate ? 'saucelabs' : []
    ),

    tapReporter: {
      prettify: require('faucet') // require('tap-spec')
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
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },

    frameworks: ['tap'],

    files: [
      'https://polyfill.io/v3/polyfill.min.js?features=Element.prototype.append%2CElement.prototype.remove%2CCustomEvent',
      'https://unpkg.com/@webcomponents/custom-elements',
      {
        pattern: config.grep || 'packages/playerx/test/test.js',
        watched: false
      },
    ],

    preprocessors: {
      'packages/playerx*/**/test.js': ['rollup']
    },

    rollupPreprocessor: {
      output: {
        format: 'iife', // Helps prevent naming collisions.
        name: 'playerxTest', // Required for 'iife' format.
        sourcemap: 'inline' // Sensible for testing.
      },
      preserveSymlinks: true,
      plugins: [
        alias({
          entries: {
            tape: 'tape-browser'
          }
        }),
        nodeResolve(),
        commonjs(),
        istanbul({
          include: config.grep ?
            config.grep.replace('/test/', '/src/') :
            'packages/*/!(htm)/**/src/**/*.js'
        }),
        automate && babel({
          include: [
            'packages/playerx/**'
          ]
        })
      ].filter(Boolean),
      onwarn: (msg) => /eval/.test(msg) && void 0
    }
  });
};
