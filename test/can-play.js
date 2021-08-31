import yaml from 'js-yaml';
import test from 'tape';
import { options } from '../src/playerx/options.js';

let players;
(async () => {
  // Get document, or throw exception on error
  try {
    const response = await fetch('./base/site/src/_data/players.yaml');
    const text = await response.text();
    players = yaml.load(text);
  } catch (e) {
    console.warn(e);
  }
})();

test(`canPlay`, async (t) => {

  for (const key in players) {
    players[key].clips.forEach(src => {
      if (options.players[key]) {
        t.assert(options.players[key].canPlay(src), `can play ${src}`);
      }
    });
  }

  t.assert(options.players.html.canPlay([{
    src: 'https://stream.mux.com/LvkSQ3bpRjLS9sCIzJlpccO9TW6dP3At00ypl6SXKrgM/low.mp4'
  }]), 'can play file src in plain object');

  t.assert(!options.players.html.canPlay([{
    src: 'https://stream.mux.com/LvkSQ3bpRjLS9sCIzJlpccO9TW6dP3At00ypl6SXKrgM/low'
  }]), 'can not play file without extension');

  t.end();
});
