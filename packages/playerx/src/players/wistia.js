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

    api.elem().addEventListener('play', () => {
      element.fire('play');
    });

    api.elem().addEventListener('durationchange', () => {
      element.fire('durationchange');
    });

    ready.resolve();
  }

  const eventAliases = {
    playing: 'play',
    ratechange: 'playbackratechange',
    timeupdate: 'timechange',
    ended: 'end',
  };

  const customEvents = {
    play: undefined,
    durationchange: undefined,
  };

  const meta = {
    get identifier() { return api.hashedId(); },
    get name() { return api.name(); },
  };

  const methods = {
    name: 'Wistia',
    version: '1.x.x',
    meta,

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoWidth() {
      return api.elem().videoWidth;
    },

    get videoHeight() {
      return api.elem().videoHeight;
    },

    get error() {
      return api.elem().error;
    },

    ready() {
      return ready;
    },

    play() {
      // wistia.play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    getPaused() {
      // Possible values are beforeplay, playing, paused and ended.
      return api.state() !== 'playing';
    },

    remove() {
      api.remove();
      removeNode(div);
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.bind(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.unbind(eventAliases[eventName] || eventName, callback);
    },

    setSrc() {
      // Must return promise here to await ready state.
      return element.load();

      // `api.replaceWith` works but does strange things with resizing ;(
      // api.replaceWith(getMetaId(MATCH_SRC, src), getOptions());
    },

    set currentTime(seconds) {
      api.time(seconds);
    },

    get currentTime() {
      return api.time();
    },

    get buffered() {
      return api.elem().buffered;
    },

    set controls(controls) {
      api.bigPlayButtonEnabled(controls);
      controls ? api.releaseChromeless() : api.requestChromeless();
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
