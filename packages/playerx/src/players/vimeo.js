// https://github.com/vimeo/player.js

import * as Events from '../constants/events.js';
import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { PlayerError } from '../helpers/error.js';
import { getVideoId } from '../helpers/url.js';
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

/**
 * Returns true if the source can be played by this player.
 * @param  {string} src
 * @return {boolean}
 */
vimeo.canPlay = src => MATCH_URL.test(src);

export function vimeo(element) {
  let api;
  let iframe;
  let ready = publicPromise();

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      muted: element.muted,
      loop: element.loop,
      playsinline: element.playsinline,
      controls: element.controls,
      url: element.src,
      transparent: false,
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

    api.on('ratechange', ({ playbackRate }) => {
      element.setCache('playbackRate', playbackRate);
    });

    api.on('error', ({ name, message }) => {
      element.setCache('error', new PlayerError(name, message));
    });

    // Vimeo's thumb outro loads new clips directly in the player
    // Update src attribute and fire load src events for metrics, etc.
    api.on('loaded', ({ id }) => {
      const vidId = getVideoId(MATCH_URL, element.src);
      if (String(id) !== vidId) {
        element.setCache('src', `https://vimeo.com/${id}`);
        element.fire(Events.LOADSRC);
        element.fire(Events.LOADEDSRC);
      }
    });

    await api.ready();
    ready.resolve();
  }

  const customEvents = {
    resize: undefined,
    loaded: undefined,
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
      if (eventName in customEvents) return;
      api.on(eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.off(eventName, callback);
    },

    setSrc() {
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

  return methods;
}

export const Vimeo = define('player-vimeo', vimeo);
