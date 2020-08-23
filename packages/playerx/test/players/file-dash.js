import { testPlayer } from '../player.js';

const src = 'https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd';
const duration = 194;

const tests = {
  play: true,
};

testPlayer({ src, duration, tests });
