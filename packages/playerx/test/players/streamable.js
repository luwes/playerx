import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://streamable.com/aizxh';
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
      // Streamable had issues with play/pause states in Firefox
      firefox: false,
      // Streamable had issues with resetting timeline in Safari
      safari: false,
    },
  },
  remove: false,
};

testPlayer({ src, duration, tests });
