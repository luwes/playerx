import { testPlayer } from '../player.js';

const src = 'https://www.twitch.tv/videos/566280744';
const duration = 45;

const tests = {
  basic: {
    browsers: {
      ie: false,
    },
  },
  volume: false,
  play: true,
};

testPlayer({ src, duration, tests });
