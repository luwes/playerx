import { testPlayer } from '../player.js';

const src = 'https://www.youtube.com/watch?v=BK1JIjLPwaA';
const duration = 46;

const tests = {
  // YT play/pause state still buggy in CI
  play: false,
  // YT volume controls are buggy in CI
  volume: false,
  remove: false,
};

testPlayer({ src, duration, tests });
