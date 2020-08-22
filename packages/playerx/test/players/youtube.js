import { testPlayer } from '../player.js';

const src = 'https://www.youtube.com/watch?v=BK1JIjLPwaA';
const duration = 46;

const tests = {
  volume: false,
};

testPlayer({ src, duration, tests });
