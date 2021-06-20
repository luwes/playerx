import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://share.vidyard.com/watch/TYY9iSji3mJuFqp2oj4FoL?';
const duration = 46;

const tests = {
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // DASH fails on Safari, not sure why
      firefox: false,
    },
  },
  volume: {
    async: true,
  },
};

testPlayer({ src, duration, tests });
