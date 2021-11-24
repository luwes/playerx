// https://bitmovin.com/docs/player/getting-started/web

import {
  createElement,
  loadScript,
  publicPromise,
} from '../utils.js';

const API_URL = 'https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js';
const API_GLOBAL = 'bitmovin';

export function createPlayer(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.bitmovin,
    };
  }

  async function init() {
    const opts = getOptions();

    ready = publicPromise();
    div = createElement('div');

    const bitmovin = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new bitmovin.player.Player(div, {
      key: opts.key,
      playback: opts,
    });

    await load(getOptions());
    ready.resolve();
  }

  async function load(opts) {
    const srcConfig = {};
    if (opts.src.includes('.m3u8')) {
      srcConfig.hls = opts.src;
    }
    await api.load(srcConfig);
    if (opts.autoplay) {
      await api.play();
    }
  }

  const meta = {
    get identifier() { return ''; },
  };

  const methods = {
    key: 'bitmovin',
    name: 'Bitmovin',
    version: '8.x.x',
    meta,

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    async setSrc() {
      ready = publicPromise();
      await load(getOptions());
      ready.resolve();
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    set volume(volume) {
      api.setVolume(volume * 100);
    },

    get volume() {
      return api.getVolume() / 100;
    },

    set muted(muted) {
      muted ? api.mute() : api.unmute();
    },

    get muted() {
      return api.isMuted();
    },
  };

  init();

  return methods;
}
