require('dotenv').config();
const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
  default: {
    player: null,
  },
});

const options = {
  sessionName: 'Playback',
  buildName:
    'Playback ' +
    (process.env.GITHUB_RUN_ID || process.env.TRAVIS_BUILD_NUMBER || 0),
  projectName: 'Playerx Benchmark',
  debug: true,
  consoleLogs: 'verbose',
};

const commonCapabilities = {
  browser: 'chrome',
  'acceptSslCerts': true,
  'browserstack.use_w3c': true,
  'browserstack.local': true,
  'bstack:options': {
    ...options,
  },
};

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACC_KEY',
  services: [
    ['browserstack', {
      browserstackLocal: true,
      opts: {

      }
    }]
  ],

  updateJob: false,
  specs: [
    'players/brightcove.js',
    'players/dailymotion.js',
    'players/facebook.js',
    'players/file.js',
    'players/jw-player.js',
    // 'players/soundcloud.js',  // less useful to test compared to video players
    'players/streamable.js',
    'players/twitch.js',
    'players/vidyard.js',
    'players/vimeo.js',
    'players/wistia.js',
    'players/youtube.js',
  ],
  exclude: [],

  beforeSession: function (config, capabilities, specs) {
    capabilities.name = (specs && specs[0].split('/').pop()) || undefined;
  },

  maxInstances: 4,

  capabilities: [
    {
      ...commonCapabilities,
      'bstack:options': {
        ...options,
        osVersion: '13',
        deviceName: 'iPad 7th',
        realMobile: 'true',
        geoLocation: 'JP',
        networkProfile: '4g-lte-lossy',
      },
    },
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

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 2 * 60 * 1000, // 2min
  },
};
