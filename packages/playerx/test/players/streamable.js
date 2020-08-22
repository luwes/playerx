import { testPlayer } from '../player.js';

const src = 'https://streamable.com/aizxh';
const duration = 46;

const tests = {
  basic: {
    browsers: {
      ie: false,
    },
  },
};

testPlayer({ src, duration, tests });
