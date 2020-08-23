import { testPlayer } from '../player.js';

const src = 'https://www.dailymotion.com/video/x7sgamf';
const duration = 46;

const tests = {
  basic: {
    browsers: {
      ie: false,
      // threw an error, 'VIDEOJS:', 'ERROR:', '(CODE:3 MEDIA_ERR_DECODE)'
      safari: false,
      // error, showed message 'Gone'.
      firefox: false,
    },
  },
  remove: false,
};

testPlayer({ src, duration, tests });
