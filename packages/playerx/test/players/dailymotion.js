import { testPlayer } from '../player.js';

const src = 'https://www.dailymotion.com/video/x7sgamf';
const duration = 46;

const tests = {
  basic: {
    browsers: {
      ie: false,
    },
  },
};

testPlayer({ src, duration, tests });
