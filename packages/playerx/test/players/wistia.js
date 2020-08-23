import { testPlayer } from '../player.js';

const src = 'https://wesleyluyten.wistia.com/medias/dgzftn5ctz';
const duration = 46;

const tests = {
  play: true,
};

testPlayer({ src, duration, tests });
