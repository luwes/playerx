import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://www.dailymotion.com/video/x7sgamf';
const duration = 46;

const tests = {
  basic: {
    browsers: {
      ie: false,
    },
  },
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // DM has issues with play/pause state.
      safari: false,
    },
  },
  remove: false,
};

testPlayer({ src, duration, tests });
