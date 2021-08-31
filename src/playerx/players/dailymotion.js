// https://developer.dailymotion.com/player/

import { dailymotion as MATCH_SRC } from '../constants/src-regex.js';
import { allow, getMetaId, createPlayPromise } from '../helpers.js';
import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  createTimeRanges,
} from '../utils.js';

const API_URL = 'https://api.dmcdn.net/all.js';
const API_GLOBAL = 'DM';
const API_GLOBAL_READY = 'dmAsyncInit';

export function createPlayer(element) {
  let api;
  let div;
  let ready = publicPromise();

  function getOptions() {
    return {
      video: getMetaId(MATCH_SRC, element.src),
      autoplay: element.playing || element.autoplay,
      loop: element.loop,
      muted: element.muted,
      controls: element.controls,
      origin: location.origin,
      'queue-enable': false,
      // 'ui-logo': false,
      ...element.config.dailymotion,
    };
  }

  async function init() {
    const params = getOptions();
    const video = getMetaId(MATCH_SRC, element.src);
    div = createElement('div');

    const DM = await loadScript(
      params.apiUrl || API_URL,
      API_GLOBAL,
      API_GLOBAL_READY
    );
    api = DM.player(div, {
      video,
      params,
      width: '100%',
      height: '100%',
      events: {
        apiready: ready.resolve,
      },
    });
    api.allow = allow;
  }

  const eventAliases = {
    ended: 'end',
  };

  const unsupported = {
    playbackRate: undefined,
  };

  const meta = {
    get identifier() { return api.video.videoId; },
    get name() { return new URLSearchParams(`t=${api.video.title}`).get('t'); },
  };

  const methods = {
    name: 'Dailymotion',
    version: '1.x.x',
    unsupported,
    meta,

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoWidth() {
      let value = +api.quality;
      const ratio = element.clientHeight / element.clientWidth;
      if (ratio < 1) {
        value /= ratio;
      }
      return value;
    },

    get videoHeight() {
      let value = +api.quality;
      const ratio = element.clientHeight / element.clientWidth;
      if (ratio > 1) {
        value *= ratio;
      }
      return value;
    },

    ready() {
      return ready;
    },

    remove() {
      api.destroy(api.id);
      removeNode(div);
    },

    play() {
      // play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    on(eventName, callback) {
      api.addEventListener(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      api.removeEventListener(eventAliases[eventName] || eventName, callback);
    },

    setSrc() {
      api.load(getOptions());
    },

    get loop() {
      // api.loop doesn't return a correct value.
      return element.cache('loop');
    },

    get muted() {
      return element.cache('muted');
    },

    get volume() {
      return element.cache('volume');
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    getBuffered() {
      return createTimeRanges(0, api.bufferedTime);
    },
  };

  init();

  return methods;
}
