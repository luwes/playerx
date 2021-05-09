require('dotenv').config();
const pkg = require('../playerx/package.json');

const sauceOptions = {
  extendedDebugging: true,
  build: 'Playback ' +
    (process.env.GITHUB_RUN_NUMBER || process.env.TRAVIS_BUILD_NUMBER || 0),
  public: 'public restricted',
  'custom-data': {
    release: pkg.version
  },
};

const commonCapabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  platformName: 'Windows 10',
  acceptInsecureCerts: true,
  // https://www.selenium.dev/documentation/en/webdriver/page_loading_strategy/
  pageLoadStrategy: 'eager', // makes browser.url() resolve on DOMContentLoaded
  'sauce:options': sauceOptions,
  'plx:options': {
    clip: 3,
    saucenetwork: 'Good 3G'
  },
};

exports.config = {
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  services: [
    ['sauce', {
      sauceConnect: true,
      sauceConnectOpts: {
        // ...
      }
    }]
  ],

  updateJob: false,
  specs: [
    'players/brightcove.js',
    'players/dailymotion.js',
    'players/hlsjs.js',
    'players/dashjs.js',
    'players/videojs.js',
    'players/apivideo.js',
    'players/streamable.js',
    'players/vidyard.js',
    'players/vimeo.js',
    'players/wistia.js',
    'players/youtube.js',
    'players/jwplayer.js',
    'players/shakaplayer.js',
    'players/theoplayer.js',
    'players/facebook.js',       // facebook doesn't autoplay always
    // 'players/soundcloud.js',  // less useful to test compared to video players
    // 'players/twitch.js',      // twitch VOD is not good
  ],
  exclude: [],

  maxInstances: 5,

  capabilities: [
    {
      ...commonCapabilities,
    },
    {
      ...commonCapabilities,
      'sauce:options': {
        ...sauceOptions,
        screenResolution: '1600x1200',
      },
      'plx:options': {
        page: 'players',
      },
    },
  ],

  logLevel: 'warn',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  waitforTimeout: 3 * 60 * 1000, // 3min
  connectionRetryTimeout: 3 * 60 * 1000, // 3min
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 3 * 60 * 1000, // 3min
  },
};
