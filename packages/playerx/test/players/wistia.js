import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://wesleyluyten.wistia.com/medias/dgzftn5ctz';
const duration = 46;

const tests = {
  play: {
    browsers: {
      ...defaultBrowsers(true),
      safari: false,
    },
  },
};

testPlayer({ src, duration, tests });
