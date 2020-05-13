// https://github.com/vimeo/player.js

import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { PlayerError } from '../helpers/error.js';
import { getVideoId } from '../helpers/url.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { serialize, boolToBinary } from '../utils/url.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { options } from '../options.js';
export { options };

const EMBED_BASE = 'https://player.vimeo.com/video';
const API_URL = 'https://player.vimeo.com/api/player.js';
const API_GLOBAL = 'Vimeo';
const MATCH_URL = /vimeo\.com\/(?:video\/)?(\d+)/;

vimeo.canPlay = src => MATCH_URL.test(src);

export function vimeo(element) {
  let api;
  let iframe;
  let ready = publicPromise();
  let style = createResponsiveStyle(element);

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      muted: element.muted,
      loop: element.loop,
      playsinline: element.playsinline,
      controls: element.controls,
      url: element.src,
      ...element.config.vimeo,
    };
  }

  async function init() {
    const opts = getOptions();
    const videoId = getVideoId(MATCH_URL, element.src);
    const src = `${EMBED_BASE}/${videoId}?${serialize(boolToBinary(opts))}`;
    iframe = createEmbedIframe({ src });

    const Vimeo = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new Vimeo.Player(iframe);

    api.on('playbackratechange', ({ playbackRate }) => {
      element.setProp('playbackRate', playbackRate);
    });

    api.on('error', ({ name, message }) => {
      element.setProp('error', new PlayerError(name, message));
    });

    await api.ready();
    ready.resolve();
  }

  const eventAliases = {
    ratechange: 'playbackratechange',
  };

  const methods = {
    name: 'Vimeo',
    version: '3.x.x',

    get element() {
      return iframe;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      return api.destroy();
    },

    stop() {
      return api.unload();
    },

    on(eventName, callback) {
      api.on(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      api.off(eventAliases[eventName] || eventName, callback);
    },

    setSrc() {
      style.update(element);
      return api.loadVideo(getOptions());
    },

    setControls() {
      return api.loadVideo(getOptions());
    },

    async getBuffered() {
      return createTimeRanges(await api.getBuffered());
    },
  };

  init();

  return extend(style.methods, methods);
}

export const Vimeo = define('player-vimeo', vimeo);
