import { testPlayer } from '../player.js';

const src = 'https://www.youtube.com/watch?v=BK1JIjLPwaA';
const duration = 46;

const tests = {
  play: true,
  // YT volume controls are buggy in CI
  volume: false,
  remove: false,
};

testPlayer({ src, duration, tests });
