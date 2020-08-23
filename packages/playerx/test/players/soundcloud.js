import { testPlayer } from '../player.js';

const src = 'https://soundcloud.com/areckoner/winter-fingers';
const duration = 213;

const tests = {
  remove: false,
};

testPlayer({ src, duration, tests });
