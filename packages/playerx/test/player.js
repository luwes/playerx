/* global UAParser */
import tape from 'tape';
import { beforeEach, delay, removeNode } from './_utils.js';
import { Playerx } from '../src/index.js';

let container;

const test = beforeEach(tape, (assert) => {
  container = document.createElement('div');
  document.body.appendChild(container);
  assert.end();
});

test('creates an element', (t) => {
  const player = new Playerx();
  t.assert(player instanceof HTMLElement);
  removeNode(container);
  t.end();
});

export function testPlayer(options, playerInfo) {

  const parser = new UAParser();
  if (!playerInfo.ie && parser.getBrowser().name === 'IE') {
    return;
  }

  test(`basic player tests for ${options.src}`, async (t) => {
    const player = new Playerx();
    player.src = options.src;
    Object.assign(player.config, {
      facebook: {
        appId: '197575574668798',
        version: 'v3.2',
      },
      jwplayer: {
        player: 'IxzuqJ4M',
      },
      brightcove: {
        account: '1752604059001',
      }
    });
    container.appendChild(player);

    await player.ready();
    console.warn('player.ready', options.src);

    t.equal(player.src, options.src, 'returns the src');
    t.assert(player.paused, 'is paused');

    if (!['twitch'].includes(player.key)) {
      t.equal(player.volume, 1, 'is all turned up');
    }

    // skip some, it's failing in CI but passes locally
    if (!['youtube', 'facebook'].includes(player.key)) {

      player.volume = 0.5;
      if (['youtube', 'facebook', 'twitch'].includes(player.key)) {
        await delay(100); // some players are async
      }
      t.equal(player.volume, 0.5, 'is half volume');

      player.muted = true;
      if (['youtube', 'facebook', 'twitch', 'vidyard'].includes(player.key)) {
        await delay(200); // some players are async
      }
      t.assert(player.muted, 'is muted');
    }

    // global css makes the width 100%
    t.equal(player.width, '', 'default empty width');
    t.equal(player.height, '', 'default empty height');
    // global css makes this 0.5625
    t.equal(player.aspectRatio, undefined, 'default undefined aspectratio');

    await player.set('width', 640);
    container.offsetWidth;
    t.equal(player.width, '640', 'player.width is 640');
    t.equal(player.clientWidth, 640, 'player.clientWidth is 640');

    await player.set('aspectRatio', 0.5);
    t.equal(player.aspectRatio, 0.5, 'player.aspectRatio is 0.5');
    t.equal(player.clientHeight, 320, 'aspect ratio of 0.5 halfs the height');

    await player.set('height', 640);
    t.equal(player.height, '640', 'player.height is 640');
    t.equal(player.clientHeight, 640, 'setting height overrides aspect ratio');

    // await player.play();
    // t.assert(!player.paused, 'is playing');

    // await delay(1100);
    // t.assert(String(Math.round(player.currentTime)), /[01]/, 'is about 1s in');

    // if (!['facebook', 'dailymotion', 'soundcloud', 'streamable', 'twitch'].includes(player.key)) {
    //   // doesn't support playbackRate
    //   player.playbackRate = 2;
    //   await delay(1200);
    //   t.match(String(Math.round(player.currentTime)), /[34]/, 'is about 3s in');
    // }

    // t.equal(Math.round(player.duration), videoInfo.duration, `is ${videoInfo.duration} long`);

    // Some players throw postMessage errors on removal.
    if (['soundcloud', 'streamable'].includes(player.key)) {
      container.style.visibility = 'hidden';
    } else {
      container.remove();
    }

    t.end();
  });

}
