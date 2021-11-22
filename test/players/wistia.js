import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://wesleyluyten.wistia.com/medias/oifkgmxnkb';
const duration = 115;

const tests = {
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // threw an error `null is not an object
      // (evaluating 'e.impl.getMediaElement')` in Saucelabs
      safari: false,
    },
  },
};

testPlayer({ src, duration, tests });
