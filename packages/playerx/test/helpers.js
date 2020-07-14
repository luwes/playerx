import test from 'tape';
import { Playerx } from '../src/index.js';
import { createPlayPromise } from '../src/helpers/video.js';

test(`createPlayPromise`, async (t) => {
  t.plan(1);

  const player = new Playerx();

  createPlayPromise(player).then(() => {
    t.assert(true, 'started playing');
  });

  player.fire('playing');
});
