require('dotenv').config();
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
  default: {
    player: null,
  },
});

const options = {
  sessionName: 'Playback',
  buildName: 'Playback ' + (process.env.TRAVIS_BUILD_NUMBER || 0),
  projectName: 'Playerx Benchmark',
  debug: true,
  consoleLogs: 'verbose',
};

const commonCapabilities = {
  browser: 'chrome',
  'browserstack.use_w3c': true,
  'bstack:options': {
    ...options,
  },
};

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACC_KEY',

  updateJob: false,
  specs: ['./index.js'],
  exclude: [],

  maxInstances: 10,

  capabilities: [
    {
      ...commonCapabilities,
    },
    {
      ...commonCapabilities,
      'bstack:options': {
        ...options,
        osVersion: '8.0',
        deviceName: 'Samsung Galaxy S9',
        realMobile: 'true',
        geoLocation: 'BR',
        networkProfile: '3.5g-hspa-good',
      },
    },
  ],

  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 1.5 * 60 * 1000, // 1.5min
  connectionRetryTimeout: 1.5 * 60 * 1000, // 1.5min
  connectionRetryCount: 3,
  host: 'hub.browserstack.com',

  before: function () {},
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 2 * 60 * 1000, // 2min
  },
};
