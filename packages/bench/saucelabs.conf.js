require('dotenv').config();

const commonCapabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  platformName: 'Windows 10',
  'sauce:options': {
      extendedDebugging: true
  }
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
    'players/facebook.js',
    'players/hlsjs.js',
    'players/dashjs.js',
    'players/apivideo.js',
    // 'players/soundcloud.js',  // less useful to test compared to video players
    'players/streamable.js',
    'players/twitch.js',
    'players/vidyard.js',
    'players/vimeo.js',
    'players/wistia.js',
    'players/youtube.js',
    'players/jw-player.js',
  ],
  exclude: [],

  maxInstances: 5,

  capabilities: [
    {
      ...commonCapabilities,
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
