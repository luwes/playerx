import { testPlayer } from '../player.js';

const src = 'https://stream.mux.com/LvkSQ3bpRjLS9sCIzJlpccO9TW6dP3At00ypl6SXKrgM.m3u8?player=theoplayer';
const duration = 46;

const tests = {
  play: true,
  // seems less accurate shows 1s into the clip instead of 3s or 4s
  playbackRate: false,
};

testPlayer({ src, duration, tests });
