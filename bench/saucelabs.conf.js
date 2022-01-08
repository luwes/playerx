require('dotenv').config();
const pkg = require('../package.json');

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
    'players/apivideo.js',
    'players/brightcove.js',
    'players/cloudflare.js',
    'players/cloudinary.js',
    'players/dailymotion.js',
    // 'players/dashjs.js',
    'players/facebook.js',       // facebook doesn't autoplay always
    // 'players/hlsjs.js',
    'players/jwplayer.js',
    'players/muxvideo.js',
    // 'players/shakaplayer.js',
    // 'players/soundcloud.js',  // less useful to test compared to video players
    'players/streamable.js',
    // 'players/theoplayer.js',
    // 'players/twitch.js',      // twitch VOD is not good
    // 'players/videojs.js',
    'players/vidyard.js',
    'players/vimeo.js',
    'players/wistia.js',
    'players/youtube.js',
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
        // capturePerformance: true,
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
