import tape from 'tape';
import spy from 'ispy';
import { beforeEach, delay } from './_utils.js';
import { Playerx } from '../src/index.js';

let container;

const test = beforeEach(tape, (assert) => {
  container = document.createElement('div');
  document.body.append(container);
  assert.end();
});

const src = 'https://vimeo.com/357274789';

test('creates an element', (t) => {
  const player = new Playerx({ src });
  t.assert(player instanceof HTMLElement);
  t.end();
});

export function testPlayer(options, videoInfo) {

  test(`basic player tests for ${options.src}`, async (t) => {
    const player = new Playerx();
    player.src = options.src;
    container.append(player);

    await player.ready();
    console.warn('player.ready');

    t.equal(player.src, options.src, 'returns the src');
    t.assert(player.paused, 'is paused');

    if (!['twitch'].includes(player.name.toLowerCase())) {
      t.equal(player.volume, 1, 'is all turned up');
    }

    player.volume = 0.5;
    if (['youtube', 'facebook', 'twitch'].includes(player.name.toLowerCase())) {
      await delay(100); // youtube is async
    }
    t.equal(player.volume, 0.5, 'is half volume');

    player.muted = true;
    if (['youtube', 'facebook', 'twitch'].includes(player.name.toLowerCase())) {
      await delay(100); // youtube is async
    }
    t.assert(player.muted, 'is muted');

    t.equal(player.width, '100%', 'default 100% width');
    t.equal(player.height, '', 'default empty height');
    t.equal(player.aspectRatio, 0.5625, 'default aspectratio of 0.5625');

    await player.set('width', 640);
    t.equal(player.clientWidth, 640, 'width is 640');

    await player.set('aspectRatio', 0.5);
    t.equal(player.clientHeight, 320, 'aspect ratio of 0.5 halfs the height');

    await player.set('height', 640);
    t.equal(player.clientHeight, 640, 'setting height overrides aspect ratio');

    await player.play();
    t.assert(!player.paused, 'is playing');

    await delay(1100);
    t.equal(Math.round(player.currentTime), 1, 'is about 1s in');

    if (!['facebook', 'dailymotion', 'soundcloud', 'streamable', 'twitch'].includes(player.name.toLowerCase())) {
      // doesn't support playbackRate
      player.playbackRate = 2;
      await delay(1200);
      t.equal(Math.round(player.currentTime), 3, 'is about 3s in');
    }

    t.equal(Math.round(player.duration), videoInfo.duration, `is ${videoInfo.duration} long`);

    t.end();
  });

}
