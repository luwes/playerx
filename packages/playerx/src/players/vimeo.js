// https://github.com/vimeo/player.js

import { vimeo as MATCH_SRC } from '../constants/src-regex.js';
import * as Events from '../constants/events.js';
import { getMetaId, PlayerError, createEmbedIframe } from '../helpers.js';
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

export function createPlayer(element, mediaContent) {
  let api;
  let iframe = mediaContent;
  let ready = publicPromise();
  let metadata = {};

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
    const metaId = getMetaId(MATCH_SRC, element.src);
    const src = `${EMBED_BASE}/${metaId}?${serialize(boolToBinary(opts))}`;
    // Allow progressive enhancement
    if (!mediaContent || !mediaContent.src || !mediaContent.src.includes(`${EMBED_BASE}/${metaId}`)) {
      iframe = createEmbedIframe({ src });
    }

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
    api.on('loaded', async ({ id }) => {
      metadata.identifier = await api.getVideoId();
      metadata.name = await api.getVideoTitle();

      const vidId = getMetaId(MATCH_SRC, element.src);
      if (String(id) !== vidId) {
        element.setCache('src', `https://vimeo.com/${id}`);
        element.fire(Events.LOADSRC);
        element.fire(Events.LOADEDSRC);
      }

      await api.ready();
      ready.resolve();
    });
  }

  const customEvents = {
    loaded: undefined,
  };

  const meta = {
    get identifier() { return metadata.identifier; },
    get name() { return metadata.name; },
  };

  const methods = {
    name: 'Vimeo',
    version: '3.x.x',
    meta,

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
