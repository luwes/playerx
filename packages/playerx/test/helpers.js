import test from 'tape';
import { Playerx } from '../src/index.js';
import { createPlayPromise } from '../src/helpers/video.js';
import { getVideoId } from '../src/helpers/url.js';

test(`createPlayPromise`, async (t) => {
  t.plan(1);

  const player = new Playerx();

  createPlayPromise(player).then(() => {
    t.assert(true, 'started playing');
  });

  player.fire('playing');
});

test(`getVideoId`, (t) => {
  t.plan(1);

  const vimeo = /vimeo\.com\/(?:video\/)?(\d+)/;
  t.equal(getVideoId(vimeo, 'https://vimeo.com/357274789'), '357274789');
});
