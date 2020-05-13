// https://developer.jwplayer.com/jwplayer/docs/jw8-javascript-api-reference

import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { PlayerError } from '../helpers/error.js';
import { getVideoId } from '../helpers/url.js';
import { createElement } from '../utils/dom.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://ssl.p.jwpcdn.com/player/v/8.12.5/jwplayer.js';
const API_GLOBAL = 'jwplayer';
const MATCH_URL = /jwplayer\.com\/players\/(\w+)(?:-(\w+))?/;

jwplayer.canPlay = src => MATCH_URL.test(src);

export function jwplayer(element) {
  let api;
  let div;
  let ready;
  let style = createResponsiveStyle(element, 'div');

  function getOptions() {
    return {
      autostart: element.playing || element.autoplay,
      preload: element.preload,
      ...element.config.jwplayer,
    };
  }

  async function getMedia(id) {
    const mediaUrl = `https://cdn.jwplayer.com/v2/media/${id}`;
    return (await fetch(mediaUrl)).json();
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const id = getVideoId(MATCH_URL, element.src);

    div = createElement('div');

    const playerUrl = `https://content.jwplatform.com/libraries/${opts.player}.js`;
    const scriptUrl = opts.key ? (opts.apiUrl || API_URL) : playerUrl;
    const JW = await loadScript(scriptUrl, API_GLOBAL);
    const media = await getMedia(id);
    api = JW(div).setup({
      ...media,
      ...opts
    });

    api.on('error', onError);

    await promisify(api.on, api)('ready');
    ready.resolve();
  }

  function onError({ code, message }) {
    element.setProp('error', new PlayerError(code, message));
  }

  const eventAliases = {
    ended: 'complete',
  };

  const methods = {
    name: 'JWPlayer',
    version: '8.x.x',

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoId() {
      return getVideoId(MATCH_URL, element.src);
    },

    get videoWidth() {
      const quality = api.getVisualQuality();
      return quality ? quality.level.width : undefined;
    },

    get videoHeight() {
      const quality = api.getVisualQuality();
      return quality ? quality.level.height : undefined;
    },

    ready() {
      return ready;
    },

    remove() {
      api.remove();
      div.remove();
    },

    on(eventName, callback) {
      api.on(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      api.off(eventAliases[eventName] || eventName, callback);
    },

    setSrc() {
      style.update(element);
      element.load();
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    get currentTime() {
      return api.getPosition();
    },

    set volume(volume) {
      api.setVolume(volume * 100);
    },

    get volume() {
      return api.getVolume() / 100;
    },

    set muted(muted) {
      api.setMute(muted);
    },

    get muted() {
      return api.getMute();
    },

    set loop(repeat) {
      api.setConfig({ repeat });
    },

    get loop() {
      return api.getConfig().repeat;
    },

    async getBuffered() {
      return createTimeRanges(0, api.getBuffer() / 100 * api.getDuration());
    },
  };

  init();

  return extend(style.methods, methods);
}

export const Jwplayer = define('player-jwplayer', jwplayer);
