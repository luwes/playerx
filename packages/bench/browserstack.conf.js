require('dotenv').config();

const options = {
  buildName:
    'Playback ' +
    (process.env.GITHUB_RUN_NUMBER || process.env.TRAVIS_BUILD_NUMBER || 0),
  projectName: 'Playerx Benchmark',
  debug: true,
  consoleLogs: 'verbose',
  chrome: {
    args: [
      '--ignore-certificate-errors',
      '--disable-web-security',
      '--autoplay-policy=no-user-gesture-required'
    ]
  },
};

const commonCapabilities = {
  browserName: 'Chrome',
  acceptInsecureCerts: true,
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
    'players/jw-player.js', // disable jw player until API works
  ],
  exclude: [],

  maxInstances: 4,

  capabilities: [
    // {
    //   ...commonCapabilities,
    //   'bstack:options': {
    //     ...options,
    //     osVersion: '13',
    //     deviceName: 'iPad 7th',
    //     realMobile: 'true',
    //     // geoLocation: 'JP',
    //     networkProfile: '4g-lte-lossy',
    //   },
    // },
    {
      ...commonCapabilities,
    },
    {
      ...commonCapabilities,
      'bstack:options': {
        ...options,
        osVersion: '8.0',
        deviceName: 'Google Pixel 2',
        realMobile: 'true',
        networkProfile: '3.5g-hspa-good',
        // geoLocation: 'BR', // sad :( The browserstack.geoLocation=BR capability was ignored for this session. IP Geolocation feature has moved out of Beta and is now only available with Enterprise plans. We recommend you to stop using this capability or upgrade to an Enterprise plan, contact us for more details
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
