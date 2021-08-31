import tape from 'tape';
import { merge } from 'lodash-es';
import {
  tapeRetries,
  tapePrefix,
  delay,
  removeNode,
  isTestEnabled,
} from './_utils.js';
import { Playerx } from '../src/playerx/index.js';

let test = tapePrefix(tapeRetries(tape));

export function testPlayer(options, cb) {
  const tests = merge({}, defaultTests, options.tests);
  let skip = !isTestEnabled('basic', tests);

  test(`Basic player tests for ${options.src}`, { skip }, async (t) => {
    t.retries(3);
    t.timeoutAfter(10000); // 10s

    let ctx = setUp({ options, tests });
    const { player, container } = ctx;
    t.prefix = (msg) => `[${player.key}] ${msg}`;

    await player.ready();
    console.warn(t.prefix(`player.ready()`));

    if (cb) ctx = cb(ctx);

    t.equal(typeof player.api, 'object', 'internal `api` getter is an object');

    t.equal(typeof player.meta.identifier, 'string', 'identifier is a string');
    t.assert(player.meta.identifier != '', 'videoId is not empty');

    // t.equal(player.buffered.length, 0, 'buffered ranges are empty on init');

    t.equal(player.src, options.src, 'returns the src');
    t.assert(player.paused, 'is paused on initialization');
    t.assert(!player.ended, 'is not ended');

    t.assert(!player.loop, 'loop is false by default');
    player.loop = true;
    t.assert(player.loop, 'loop is true');

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

    /**
     * Volume tests
     */
    t.comment(`Volume tests for ${options.src}`);
    skip = !isTestEnabled('volume', tests);

    t.equal(player.volume, 1, 'is all turned up', { skip });

    player.volume = 0.5;
    if (tests.volume.async) {
      await delay(200);
    }
    t.equal(player.volume, 0.5, 'is half volume', { skip });

    player.muted = true;
    if (tests.volume.async) {
      await delay(200);
    }
    t.assert(player.muted, 'is muted', { skip });

    /**
     * Play tests
     */
    t.comment(`Play tests for ${options.src}`);
    skip = !isTestEnabled('play', tests);

    try {
      await Promise.race([
        player.play(),
        // Wistia doesn't resolve promise on Safari CI
        // Removed delay because it was too short for Vimeo and failed assert below
        // delay(2000),
      ]);
    } catch (error) {
      console.warn(error);
    }
    t.assert(!player.paused, 'is playing after player.play()', { skip });

    await delay(1100);
    t.assert(String(Math.round(player.currentTime)), /[01]/, 'is about 1s in', {
      skip,
    });

    if (player.supports('playbackRate')) {
      // doesn't support playbackRate
      player.playbackRate = 2;
      await delay(1500);
      t.match(
        String(Math.round(player.currentTime)),
        /[34]/,
        'is about 3s in',
        { skip: skip || !isTestEnabled('playbackRate', tests) }
      );
      player.playbackRate = 1;
    }

    player.playing = false;
    await delay(250);
    t.assert(player.paused, 'is paused after player.playing = false', { skip });

    player.playing = true;
    await delay(250);
    t.assert(!player.paused, 'is playing after player.playing = true', {
      skip,
    });

    t.equal(
      Math.round(player.duration),
      options.duration,
      `is ${options.duration} long`,
      { skip }
    );

    tearDown(ctx);
    t.end();
  });
}

export const defaultBrowsers = (enabled = true) => ({
  chrome: enabled,
  firefox: enabled,
  safari: enabled,
  edge: enabled,
  ie: enabled,
});

const defaultTests = {
  play: false,
  basic: {
    browsers: { ...defaultBrowsers(true) },
  },
  volume: {
    browsers: { ...defaultBrowsers(true) },
  },
  playbackRate: {
    browsers: { ...defaultBrowsers(true) },
  }
};

function setUp(ctx) {
  let player;
  let container;

  try {
    player = new Playerx();
    player.src = ctx.options.src;
    player.preload = 'none';
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
      wistia: {
        doNotTrack: true,
      },
      theoplayer: {
        libraryLocation: 'https://cdn.myth.theoplayer.com/7d1ab703-8b6b-4c29-9598-d6c2f92cfe33',
        license: 'sZP7IYe6T6frCKfz0KxK06klIKhiFSazIle-Tu5r36zLCSao0l0zIDXKCSe6FOPlUY3zWokgbgjNIOf9flXg0SbiCD3eFSCi3lC-3uRcTOk60l0kFS0L3DhrTSaiClbr0OfVfK4_bQgZCYxNWoryIQXzImf90SCZ3u5c0uai0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lB_3Lfz0lai0LCcFOPeWok1dDrLYtA1Ioh6TgV6UQ1gWtAVCYggb6rlWoz6FOPVWo31WQ1qbta6FOfJfgzVfKxqWDXNWG3ybojkbK3gflNWfGxEIDjiWQXrIYfpCoj-f6i6WQjlCDcEWt3zf6i6v6PUFOPLIQ-LflNWfK1zWDikfgzVfG3gWKxydDkibK4LbogqW6f9UwPkIYz'
      }
    });

    container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(player);
  } catch (error) {
    console.warn(error);
  }

  return { ...ctx, player, container };
}

function tearDown(ctx) {
  console.warn(`Removing ${ctx.options.src}`);

  // Some players throw postMessage errors on removal.
  if (ctx.tests.remove === false) {
    ctx.container.style.visibility = 'hidden';
    ctx.container.style.overflow = 'hidden';
    ctx.container.style.width = '0';
    ctx.container.style.height = '0';
  } else {
    removeNode(ctx.container);
  }
}
