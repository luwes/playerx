// https://dev.twitch.tv/docs/embed/video-and-clips

import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { getVideoId } from '../helpers/url.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { createElement } from '../utils/dom.js';
import { uniqueId } from '../utils/utils.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://player.twitch.tv/js/embed/v1.js';
const API_GLOBAL = 'Twitch';
const MATCH_URL = /twitch\.tv\/videos\/(\d+)($|\?)/;

twitch.canPlay = src => MATCH_URL.test(src);

export function twitch(element) {
  let api;
  let div;
  let ready;
  let style = createResponsiveStyle(element, 'div');

  function getOptions() {
    return {
      video: getVideoId(MATCH_URL, element.src),
      height: '100%',
      width: '100%',
      autoplay: element.playing || element.autoplay,
      loop: element.loop,
      playsinline: element.playsinline,
      controls: element.controls,
      ...element.config.twitch,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const id = uniqueId('tc');

    div = createElement('div', { id });

    const Twitch = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new Twitch.Player(id, opts);

    await promisify(api.addEventListener, api)('ready');
    ready.resolve();
  }

  const methods = {
    name: 'Twitch',
    version: '1.x.x',

    get element() {
      return div;
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
      api.destroy();
      div.remove();
    },

    stop() {
      api.seek(0);
    },

    on(eventName, callback) {
      api.addEventListener(eventName, callback);
    },

    off(eventName, callback) {
      api.removeEventListener(eventName, callback);
    },

    set src(value) {
      style.update(element);
      api.setVideo('v' + getVideoId(MATCH_URL, element.src));
    },

    set controls(value) {
      api.showPlayerControls(value);
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    async getBuffered() {
      const loaded = api.getPlaybackStats().bufferSize + api.getCurrentTime();
      return createTimeRanges(0, loaded);
    },
  };

  init();

  return extend(style.methods, methods);
}

export const Twitch = define('player-twitch', twitch);
