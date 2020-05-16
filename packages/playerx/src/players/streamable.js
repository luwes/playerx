// https://github.com/embedly/player.js

import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { getVideoId } from '../helpers/url.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { createPlayPromise } from '../helpers/video.js';
import { options } from '../options.js';
export { options };

const EMBED_BASE = 'https://streamable.com/o';
const API_URL = 'https://cdn.embed.ly/player-0.1.0.min.js';
const API_GLOBAL = 'playerjs';
const MATCH_URL = /streamable\.com\/(\w+)$/;

streamable.canPlay = src => MATCH_URL.test(src);

export function streamable(element) {
  let api;
  let iframe;
  let ready;
  let style = createResponsiveStyle(element);

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      muted: element.muted,
      loop: element.loop,
      ...element.config.streamable,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const videoId = getVideoId(MATCH_URL, element.src);
    const src = `${EMBED_BASE}/${videoId}`;
    iframe = createEmbedIframe({ src });

    const playerjs = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new playerjs.Player(iframe);

    opts.autoplay && api.play();

    await promisify(api.on, api)('ready');
    ready.resolve();
  }

  const eventAliases = {
    playing: 'play',
  };

  const customEvents = {
    progress: undefined,
  };

  const methods = {
    name: 'Streamable',
    version: '1.x.x',

    get element() {
      return iframe;
    },

    get api() {
      return api;
    },

    get videoId() {
      return getVideoId(MATCH_URL, element.src);
    },

    ready() {
      return ready;
    },

    remove() {
      iframe.remove();
    },

    play() {
      // play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    stop() {
      element.currentTime = 1e9;
      element.play();
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.on(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.off(eventAliases[eventName] || eventName, callback);
    },

    set src(value) {
      style.update(element);
      element.load();
    },

    async getPaused() {
      return promisify(api.getPaused, api)();
    },

    async getCurrentTime() {
      return promisify(api.getCurrentTime, api)();
    },

    async getDuration() {
      return promisify(api.getDuration, api)();
    },

    async getLoop() {
      return promisify(api.getLoop, api)();
    },

    set volume(volume) {
      api.setVolume(volume * 100);
    },

    async getVolume() {
      const volume = await promisify(api.getVolume, api)();
      return volume / 100;
    },

    set muted(muted) {
      muted ? api.mute() : api.unmute();
    },

    async getMuted() {
      return promisify(api.getMuted, api)();
    },

    async getBuffered() {
      // bug in player.js - https://github.com/embedly/player.js/issues/79
      return createTimeRanges();
    },
  };

  init();

  return extend(style.methods, methods);
}

export const Streamable = define('player-streamable', streamable);
