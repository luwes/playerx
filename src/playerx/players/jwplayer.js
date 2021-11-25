// https://developer.jwplayer.com/jwplayer/docs/jw8-javascript-api-reference

import { jwplayer as MATCH_SRC } from '../constants/src-regex.js';
import { getMetaId, createPlayPromise, PlayerError } from '../helpers.js';
import {
  addCssRule,
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  promisify,
  requestJson,
} from '../utils.js';

const API_URL = 'https://ssl.p.jwpcdn.com/player/v/8.12.5/jwplayer.js';
const API_GLOBAL = 'jwplayer';

addCssRule('.jw-no-controls [class*="jw-controls"], .jw-no-controls .jw-title', {
  display: 'none !important',
});

export function createPlayer(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      autostart: element.playing || element.autoplay,
      controls: element.controls,
      // The default value is different for each browser.
      // The spec advises it to be set to metadata.
      preload: element.preload || 'metadata',
      // player: '', // Via https://content.jwplatform.com/libraries/{player_id}.js
      // key: '',         // or https://ssl.p.jwpcdn.com/player/v/8.12.5/jwplayer.js
      ...element.config.jwplayer,
    };
  }

  async function getMedia(id) {
    const mediaUrl = `https://cdn.jwplayer.com/v2/media/${id}`;
    return await requestJson(mediaUrl);
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    div = createElement('div');

    const playerUrl = `https://content.jwplatform.com/libraries/${opts.player}.js`;
    const scriptUrl = opts.key ? opts.apiUrl || API_URL : playerUrl;
    const JW = await loadScript(scriptUrl, API_GLOBAL);
    const id = getMetaId(MATCH_SRC, element.src);
    const media = id ? await getMedia(id) : { file: element.src };
    api = JW(div).setup({
      width: '100%',
      height: '100%',
      ...media,
      ...opts,
    });

    api.on('error', onError);

    await promisify(api.on, api)('ready');

    api.getContainer().classList.toggle('jw-no-controls', !opts.controls);

    if (opts.autostart) {
      element.play();
    }

    ready.resolve();
  }

  function onError({ code, message }) {
    element.setCache('error', new PlayerError(code, message));
  }

  function getVideo() {
    return element.querySelector('.jw-video');
  }

  const meta = {
    get identifier() { return getMetaId(MATCH_SRC, element.src); },
    get name() { return api.getPlaylistItem().title; },
  };

  const methods = {
    name: 'JWPlayer',
    version: '8.x.x',
    meta,

    get element() {
      return div;
    },

    get api() {
      return getVideo();
    },

    ready() {
      return ready;
    },

    play() {
      getVideo().click();
      return createPlayPromise(element);
    },

    remove() {
      api.remove();
      removeNode(div);
    },

    on(eventName, callback) {
      getVideo().addEventListener(eventName, callback);
    },

    off(eventName, callback) {
      getVideo().removeEventListener(eventName, callback);
    },

    setSrc() {
      // Must return promise here to await ready state.
      return element.load();
    },

    set controls(value) {
      api.getContainer().classList.toggle('jw-no-controls', !value);
    },

    get controls() {
      return !api.getContainer().className.includes('jw-no-controls');
    },
  };

  init();

  return methods;
}
