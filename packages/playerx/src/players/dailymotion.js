// https://developer.dailymotion.com/player/

import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { allow } from '../helpers/dom.js';
import { createElement } from '../utils/dom.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { createTimeRanges } from '../utils/time-ranges.js';
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
  let style = createResponsiveStyle(element);

  function getOptions() {
    return {
      video: getVideoId(element.src),
      autoplay: element.playing || element.autoplay,
      loop: element.loop,
      muted: element.muted,
      controls: element.controls,
      origin: location.origin,
      ...element.config.dailymotion,
    };
  }

  function getVideoId(src) {
    let match;
    return (match = src.match(MATCH_URL)) && match[1];
  }

  async function init() {
    const params = getOptions();
    const video = getVideoId(element.src);
    div = createElement('div');

    const DM = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
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

  const customEvents = {
  };

  const methods = {

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      return api.destroy(api.id);
    },

    stop() {
      api.seek(0);
      setTimeout(() => api.pause());
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.addEventListener(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.removeEventListener(eventAliases[eventName] || eventName, callback);
    },

    set src(value) {
      style.update(element);
      api.load(getOptions());
    },

    get src() {
      return element.props.src;
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    async getBuffered() {
      return createTimeRanges(0, api.bufferedTime);
    },
  };

  init();

  return extend(style.methods, methods);
}

export const Dailymotion = define('player-dailymotion', dailymotion);
