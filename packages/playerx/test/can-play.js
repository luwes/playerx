import yaml from 'js-yaml';
import test from 'tape';
import { canPlay } from '../src/can-play.js';

let players;
(async () => {
  // Get document, or throw exception on error
  try {
    const response = await fetch('./base/packages/playerx-demo/src/_data/dev/players.yaml');
    const text = await response.text();
    players = yaml.safeLoad(text);
  } catch (e) {
    console.warn(e);
  }
})();

test(`canPlay`, async (t) => {

  for (const key in players) {
    players[key].clips.forEach(src => {
      t.assert(canPlay[key](src), `can play ${src}`);
    });
  }

  t.assert(canPlay.file([{
    src: 'https://stream.mux.com/LvkSQ3bpRjLS9sCIzJlpccO9TW6dP3At00ypl6SXKrgM/low.mp4'
  }]), 'can play file src in plain object');

  t.assert(!canPlay.file([{
    src: 'https://stream.mux.com/LvkSQ3bpRjLS9sCIzJlpccO9TW6dP3At00ypl6SXKrgM/low'
  }]), 'can not play file without extension');

  t.end();
});
