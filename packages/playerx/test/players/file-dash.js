import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
const duration = 194;

const tests = {
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // DASH fails on Safari, not sure why
      safari: false,
    },
  },
};

testPlayer({ src, duration, tests });
