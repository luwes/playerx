/* global UAParser */
import tape from 'tape';
import _ from 'lodash';
import { beforeEach, withRetries, delay, removeNode } from './_utils.js';
import { Playerx } from '../src/index.js';

let container;

let test = beforeEach(tape, (assert) => {
  container = document.createElement('div');
  document.body.appendChild(container);
  assert.end();
});
test = withRetries(test);

test('creates an element', (t) => {
  const player = new Playerx();
  t.assert(player instanceof HTMLElement);
  removeNode(container);
  t.end();
});

export const defaultBrowsers = (enabled = true) => ({
  chrome: enabled,
  firefox: enabled,
  safari: enabled,
  edge: enabled,
  ie: enabled,
});

const defaultTests = {
  basic: {
    browsers: { ...defaultBrowsers(true) },
  },
  volume: {
    browsers: { ...defaultBrowsers(true) },
  },
  play: false,
};

const isTestEnabled = (type, tests) => {
  const testSection = tests[type];
  if (!testSection) return false;

  if (typeof testSection === 'object' && testSection.browsers) {
    const parser = new UAParser();
    const browserKey = Object.keys(testSection.browsers).find((key) =>
      parser.getBrowser().name.toLowerCase().includes(key)
    );
    if (!testSection.browsers[browserKey]) return false;
  }

  return true;
};

export function testPlayer(options) {
  const tests = _.merge({}, defaultTests, options.tests);

  if (!isTestEnabled('basic', tests)) {
    return false;
  }

  test(`basic player tests for ${options.src}`, async (t) => {
    t.retries(3);
    t.timeoutAfter(10000); // 10s

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
      },
    });
    container.appendChild(player);

    await player.ready();

    const p = (msg) => `[${player.key}] ${msg}`;

    console.warn(p(`player.ready()`));

    t.equal(typeof player.api, 'object', p('internal `api` getter is an object'));

    t.equal(typeof player.videoId, 'string', p('videoId is a string'));
    t.assert(player.videoId != '', p('videoId is not empty'));

    t.equal(player.buffered.length, 0, p('buffered ranges are empty on init'));

    t.equal(player.src, options.src, p('returns the src'));
    t.assert(player.paused, p('is paused on initialization'));
    t.assert(!player.ended, p('is not ended'));

    t.assert(!player.loop, p('loop is false by default'));
    player.loop = true;
    t.assert(player.loop, p('loop is true'));

    // global css makes the width 100%
    t.equal(player.width, '', p('default empty width'));
    t.equal(player.height, '', p('default empty height'));
    // global css makes this 0.5625
    t.equal(player.aspectRatio, undefined, p('default undefined aspectratio'));

    await player.set('width', 640);
    container.offsetWidth;
    t.equal(player.width, '640', p('player.width is 640'));
    t.equal(player.clientWidth, 640, p('player.clientWidth is 640'));

    await player.set('aspectRatio', 0.5);
    t.equal(player.aspectRatio, 0.5, p('player.aspectRatio is 0.5'));
    t.equal(player.clientHeight, 320, p('aspect ratio of 0.5 halfs the height'));

    await player.set('height', 640);
    t.equal(player.height, '640', p('player.height is 640'));
    t.equal(player.clientHeight, 640, p('setting height overrides aspect ratio'));

    // skip some, it's failing in CI but passes locally
    if (isTestEnabled('volume', tests)) {

      if (!['twitch'].includes(player.key)) {
        t.equal(player.volume, 1, p('is all turned up'));
      }

      player.volume = 0.5;
      if (tests.volume.async) {
        await delay(200);
      }
      t.equal(player.volume, 0.5, p('is half volume'));

      player.muted = true;
      if (tests.volume.async) {
        await delay(200);
      }
      t.assert(player.muted, p('is muted'));
    }

    // the play tests fails for some players in Saucelabs
    if (isTestEnabled('play', tests)) {
      player.muted = true;

      await player.play();
      t.assert(!player.paused, p('is playing after player.play()'));

      await delay(1100);
      t.assert(
        String(Math.round(player.currentTime)),
        /[01]/,
        p('is about 1s in')
      );

      if (player.supports('playbackRate')) {
        // doesn't support playbackRate
        player.playbackRate = 2;
        await delay(1500);
        t.match(
          String(Math.round(player.currentTime)),
          /[34]/,
          p('is about 3s in')
        );
        player.playbackRate = 1;
      }

      player.playing = false;
      await delay(250);
      t.assert(player.paused, p('is paused after player.playing = false'));

      player.playing = true;
      await delay(250);
      t.assert(!player.paused, p('is playing after player.play()'));

      await player.stop();
      await delay(120); // add some more delay for slow CI
      t.assert(player.paused, p('is paused after player.stop()'));
      t.equal(Math.floor(player.currentTime), 0, p('timeline is reset'));

      t.equal(
        Math.round(player.duration),
        options.duration,
        p(`is ${options.duration} long`)
      );
    }

    // Some players throw postMessage errors on removal.
    if (tests.remove === false) {
      container.style.visibility = 'hidden';
    } else {
      container.remove();
    }

    t.end();
  });

}
