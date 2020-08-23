import { testPlayer, defaultBrowsers } from '../player.js';

const src =
  'https://studio.brightcove.com/products/videocloud/media/videos/4883184247001';
const duration = 50;

const tests = {
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // Brightcove throws a media decode error on Saucelabs Safari
      safari: false,
    },
  },
};

testPlayer({ src, duration, tests });
