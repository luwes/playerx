// https://wistia.com/support/developers/player-api

import { wistia as MATCH_SRC } from '../constants/src-regex.js';
import { getMetaId, createPlayPromise } from '../helpers.js';
import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
} from '../utils.js';

const API_URL = 'https://fast.wistia.com/assets/external/E-v1.js';
const API_GLOBAL = 'Wistia';

export function createPlayer(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      autoPlay: element.playing || element.autoplay,
      playsinline: element.playsinline,
      endVideoBehavior: element.loop && 'loop',
      chromeless: !element.controls,
      playButton: element.controls,
      // videoFoam: false,
      // silentAutoPlay: 'allow',
      // newLook: false,
      // playerColor: 'ff0000',
      ...element.config.wistia,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const id = getMetaId(MATCH_SRC, element.src);

    div = createElement('div', {
      class: `wistia_embed wistia_async_${id}`,
    });

    const onReadyPromise = publicPromise();
    const onReady = onReadyPromise.resolve;

    await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    window._wq.push({
      id,
      onReady,
      options: opts,
    });

    api = await onReadyPromise;

    ready.resolve();
  }

  const meta = {
    get identifier() { return api.hashedId(); },
    get name() { return api.name(); },
  };

  const methods = {
    name: 'Wistia',
    version: '2.x.x',
    meta,

    get element() {
      return div;
    },

    get api() {
      return api && api.elem();
    },

    ready() {
      return ready;
    },

    play() {
      // wistia.play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    remove() {
      api.remove();
      removeNode(div);
    },

    setSrc() {
      // Must return promise here to await ready state.
      return element.load();

      // `api.replaceWith` works but does strange things with resizing ;(
      // api.replaceWith(getMetaId(MATCH_SRC, src), getOptions());
    },

    set controls(controls) {
      api.bigPlayButtonEnabled(controls);
      controls ? api.releaseChromeless() : api.requestChromeless();
    },

    get controls() {
      return element.cache('controls');
    },
  };

  init();

  return methods;
}
