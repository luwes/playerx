import { testPlayer } from '../player.js';

const src = 'https://streamable.com/aizxh';
const duration = 46;

const tests = {
  basic: {
    browsers: {
      ie: false,
    },
  },
  play: true,
  remove: false,
};

testPlayer({ src, duration, tests });
