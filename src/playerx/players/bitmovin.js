// https://bitmovin.com/docs/player/getting-started/web

import {
  addCssRule,
  createElement,
  loadScript,
  publicPromise,
} from '../utils.js';

const API_URL = 'https://cdn.bitmovin.com/player/web/8/bitmovinplayer.js';
const API_GLOBAL = 'bitmovin';

addCssRule('.bitmovin-no-controls .bmpui-ui-uicontainer', {
  display: 'none',
});

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
    div.classList.toggle('bitmovin-no-controls', !opts.controls);

    const bitmovin = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new bitmovin.player.Player(div, {
      key: opts.key,
      playback: opts,
    });

    await load(getOptions());
    ready.resolve();
  }

  async function load(opts) {
    div.classList.toggle('bitmovin-no-controls', !opts.controls);

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
    meta,

    get version() { return api.version || ''; },

    get element() {
      return div;
    },

    get api() {
      return api.getVideoElement();
    },

    ready() {
      return ready;
    },

    on(eventName, callback) {
      api.getVideoElement().addEventListener(eventName, callback);
    },

    off(eventName, callback) {
      api.getVideoElement().removeEventListener(eventName, callback);
    },

    async setSrc() {
      ready = publicPromise();
      await load(getOptions());
      ready.resolve();
    },

    set controls(value) {
      div.classList.toggle('bitmovin-no-controls', !value);
    },
  };

  init();

  return methods;
}
