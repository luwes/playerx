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

test('custom element lifecycle callbacks work', (t) => {
  const player = new Playerx({ src });

  player._connected = spy();
  container.append(player);
  t.assert(player._connected.callCount > 0, 'connected called');

  player._attributeChanged = spy();
  player.setAttribute('width', 640);

  player._disconnected = spy();
  player.remove();
  t.assert(player._disconnected.callCount > 0, 'disconnected called');

  t.equal(player._attributeChanged.callCount, 1, 'attribute changed called');
  t.end();
});

export function testPlayer(options, videoInfo) {

  test(`basic player tests for ${options.src}`, async (t) => {
    const player = new Playerx(options);
    container.append(player);

    t.equal((await player.getSrc()), options.src, 'returns the src');
    t.assert((await player.getPaused()), 'is paused');

    t.equal((await player.getVolume()), 1, 'is all turned up');

    await player.setVolume(0.5);
    t.equal((await player.getVolume()), 0.5, 'is half volume');

    await player.setMuted(true);
    t.assert((await player.getMuted()), 'is muted');

    await player.play();
    t.assert(!(await player.getPaused()), 'is playing');

    await delay(1000);
    t.equal(Math.round(await player.getCurrentTime()), 1, 'is about 1s in');

    await player.setPlaybackRate(2);
    await delay(1000);
    t.equal(Math.round(await player.getCurrentTime()), 3, 'is about 3s in');

    t.equal(Math.round(await player.getDuration()), videoInfo.duration, `is ${videoInfo.duration} long`);

    t.equal((await player.getWidth()), '100%', 'default 100% width');
    t.equal((await player.getHeight()), undefined, 'default undefined height');
    t.equal((await player.getAspectRatio()), 0.5625, 'default aspectratio of 0.5625');

    await player.setWidth(640);
    t.equal(player.clientWidth, 640, 'width is 640');

    await player.setAspectRatio(0.5);
    t.equal(player.clientHeight, 320, 'aspect ratio of 0.5 halfs the height');

    await player.setHeight(640);
    t.equal(player.clientHeight, 640, 'setting height overrides aspect ratio');

    t.end();
  });

}
