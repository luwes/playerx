import { testPlayer } from '../player.js';

const src = 'https://vimeo.com/638369396';
const duration = 46;

const tests = {
  play: true,
};

testPlayer({ src, duration, tests });
