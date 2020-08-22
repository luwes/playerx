import { testPlayer } from '../player.js';

const src = 'https://www.facebook.com/wesleyluyten/videos/10220940465559072';
const duration = 46;

const tests = {
  volume: false,
};

testPlayer({ src, duration, tests });
