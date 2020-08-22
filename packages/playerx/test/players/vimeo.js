import { testPlayer } from '../player.js';

const src = 'https://vimeo.com/357274789';
const duration = 46;

const tests = {
  play: true,
};

testPlayer({ src, duration, tests });
