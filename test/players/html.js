import { testPlayer, defaultBrowsers } from '../player.js';

const src = 'https://stream.mux.com/LvkSQ3bpRjLS9sCIzJlpccO9TW6dP3At00ypl6SXKrgM/low.mp4';
const duration = 46;

const tests = {
  play: {
    browsers: {
      ...defaultBrowsers(true),
      // html fails on Safari, not sure why
      safari: false,
    },
  },
};

testPlayer({ src, duration, tests });
