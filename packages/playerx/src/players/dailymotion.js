// https://developer.dailymotion.com/player/

import { define } from '../define.js';
import { allow } from '../helpers/dom.js';
import { getVideoId } from '../helpers/url.js';
import { createElement } from '../utils/dom.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { createPlayPromise } from '../helpers/video.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://api.dmcdn.net/all.js';
const API_GLOBAL = 'DM';
const API_GLOBAL_READY = 'dmAsyncInit';
const MATCH_URL = /(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/(\w+)$/;

dailymotion.canPlay = src => MATCH_URL.test(src);

export function dailymotion(element) {
  let api;
  let div;
  let ready = publicPromise();

  function getOptions() {
    return {
      video: getVideoId(MATCH_URL, element.src),
      autoplay: element.playing || element.autoplay,
      loop: element.loop,
      muted: element.muted,
      controls: element.controls,
      origin: location.origin,
      ...element.config.dailymotion,
    };
  }

  async function init() {
    const params = getOptions();
    const video = getVideoId(MATCH_URL, element.src);
    div = createElement('div');

    const DM = await loadScript(params.apiUrl || API_URL, API_GLOBAL, API_GLOBAL_READY);
    api = DM.player(div, {
      video,
      params,
      events: {
        apiready: ready.resolve,
      }
    });
    api.allow = allow;
  }

  const eventAliases = {
    ended: 'end',
  };

  const methods = {
    name: 'Dailymotion',
    version: '1.x.x',

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoId() {
      return api.video.videoId;
    },

    get videoTitle() {
      return api.video.title;
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
      div.remove();
    },

    play() {
      // play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    stop() {
      api.seek(0);
      setTimeout(() => api.pause());
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

    getSrc() {
      return element.cache('src');
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

    async getBuffered() {
      return createTimeRanges(0, api.bufferedTime);
    },
  };

  init();

  return methods;
}

export const Dailymotion = define('player-dailymotion', dailymotion);
