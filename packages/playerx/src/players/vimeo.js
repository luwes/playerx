// https://github.com/vimeo/player.js

import { vimeo as MATCH_SRC } from '../constants/src-regex.js';
import * as Events from '../constants/events.js';
import { getVideoId, PlayerError, createEmbedIframe } from '../helpers.js';
import {
  boolToBinary,
  serialize,
  loadScript,
  publicPromise,
  createTimeRanges,
} from '../utils.js';

const EMBED_BASE = 'https://player.vimeo.com/video';
const API_URL = 'https://player.vimeo.com/api/player.js';
const API_GLOBAL = 'Vimeo';

export function createPlayer(element) {
  let api;
  let iframe;
  let ready = publicPromise();

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      url: element.src,
      transparent: false,
      autopause: false,
      // byline: false,
      // portrait: false,
      // title: false,
      // dnt: true,
      ...element.config.vimeo,
    };
  }

  async function init() {
    const opts = getOptions();
    const videoId = getVideoId(MATCH_SRC, element.src);
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
      const vidId = getVideoId(MATCH_SRC, element.src);
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

    get videoId() {
      return getVideoId(MATCH_SRC, element.src);
    },

    ready() {
      return ready;
    },

    remove() {
      return api.destroy();
    },

    async stop() {
      await api.setCurrentTime(0);
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
