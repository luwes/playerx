import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://soundcloud.com/areckoner/winter-fingers';
const duration = 213;

const tests = {
  remove: false,
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // Soundcloud on Chrome throws "is playing after player.play()"
      chrome: false,
    },
  },
};

testPlayer({ src, duration, tests });
