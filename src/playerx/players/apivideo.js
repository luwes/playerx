// https://docs.api.video/docs/video-player-sdk

import { apivideo as MATCH_SRC } from '../constants/src-regex.js';
import { getMetaId, createEmbedIframe } from '../helpers.js';
import {
  loadScript,
  publicPromise,
  uniqueId,
  promisify,
} from '../utils.js';

const EMBED_BASE = 'https://embed.api.video/vod';
const API_URL = 'https://unpkg.com/@api.video/player-sdk@1.2.6/dist/index.js';
const API_GLOBAL = 'PlayerSdk';

/**
 * @see https://docs.api.video/docs/video-playback-features
 * @param  {Object} props
 * @return {string} e.g. autoplay;loop
 */
function serialize(props) {
  return Object.keys(props)
    .map((key) => props[key] && key)
    .filter(Boolean)
    .join(';');
}

export function createPlayer(element) {
  let api;
  let iframe;
  let ready = publicPromise();

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      muted: element.muted,
      loop: element.loop,
      hideControls: !element.controls,
      'hide-controls': !element.controls,
      id: getMetaId(MATCH_SRC, element.src),
      ...element.config.apivideo,
    };
  }

  async function init() {
    const opts = getOptions();
    const metaId = getMetaId(MATCH_SRC, element.src);
    const src = `${EMBED_BASE}/${metaId}#${serialize(opts)}`;
    const id = uniqueId('av');
    iframe = createEmbedIframe({ src, id });

    const PlayerSdk = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);

    // The api.video sdk script removes the window.default property while
    // mux-embed relies on it to access window.default.XMLHttpRequest.
    // Set it back here.
    window.default = self;

    api = new PlayerSdk(`#${id}`);
    await promisify(api.addEventListener, api)('ready');

    api.addEventListener('qualitychange', ({ resolution }) => {
      element.setCache('videoWidth', resolution.width);
      element.setCache('videoHeight', resolution.height);
      element.fire('resize');
    });

    ready.resolve();
  }

  const meta = {
    get identifier() { return getMetaId(MATCH_SRC, element.src); },
  };

  const methods = {
    name: 'api.video',
    key: 'apivideo',
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
      return api.destroy();
    },

    on(eventName, callback) {
      api.addEventListener(eventName, callback);
    },

    off(eventName, callback) {
      if (api.removeEventListener) {
        api.removeEventListener(eventName, callback);
      }
    },

    setSrc() {
      return api.loadConfig(getOptions());
    },

    setControls() {
      return element.cache('controls') ? api.showControls() : api.hideControls();
    },

    set muted(muted) {
      muted ? api.mute() : api.unmute();
    },
  };

  init();

  return methods;
}
