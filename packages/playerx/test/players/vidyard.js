import { testPlayer } from '../player.js';

const src = 'https://share.vidyard.com/watch/TYY9iSji3mJuFqp2oj4FoL?';
const duration = 46;

const tests = {
  volume: {
    async: true,
  },
};

testPlayer({ src, duration, tests });
