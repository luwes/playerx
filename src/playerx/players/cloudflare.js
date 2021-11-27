// https://developers.cloudflare.com/stream/viewing-videos/using-the-player-api

import { cloudflare as MATCH_SRC } from '../constants/src-regex.js';
import { getMetaId, createEmbedIframe } from '../helpers.js';
import {
  serialize,
  loadScript,
  publicPromise,
} from '../utils.js';

const EMBED_BASE = 'https://iframe.videodelivery.net';
const API_URL = 'https://embed.videodelivery.net/embed/sdk.latest.js';
const API_GLOBAL = 'Stream';

export function createPlayer(element, mediaContent) {
  let api;
  let iframe = mediaContent;
  let ready = publicPromise();

  function getOptions() {
    return {
      autoplay: (element.playing || element.autoplay) ? true : undefined,
      controls: element.controls,
      src: element.src,
      ...element.config.cloudflare,
    };
  }

  async function init() {
    const opts = getOptions();
    const metaId = getMetaId(MATCH_SRC, element.src);
    const src = `${EMBED_BASE}/${metaId}?${serialize(opts)}`;
    // Allow progressive enhancement
    if (!mediaContent || !mediaContent.src || !mediaContent.src.includes(`${EMBED_BASE}/${metaId}`)) {
      iframe = createEmbedIframe({ src });
    }

    const Stream = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = Stream(iframe);

    ready.resolve();
  }

  const meta = {
    get identifier() { return getMetaId(MATCH_SRC, element.src); },
  };

  const methods = {
    key: 'cloudflare',
    name: 'Cloudflare',
    version: '1.x.x',
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
      api.destroy();
    },
  };

  init();

  return methods;
}
