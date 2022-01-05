// https://player.support.brightcove.com/coding-topics/overview-player-api.html

import { brightcove as MATCH_SRC } from '../constants/src-regex.js';
import { getMetaId } from '../helpers.js';
import {
  createElement,
  loadScript,
  publicPromise,
  promisify,
} from '../utils.js';

const API_GLOBAL = 'bc';

export function createPlayer(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      controls: element.controls,
      // account: '',
      ...element.config.brightcove,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const accountId = getMetaId(MATCH_SRC, element.src, 1)
    const metaId = getMetaId(MATCH_SRC, element.src, 4);

    div = createElement('video-js', {
      controls: opts.controls ? '' : null,
      'data-video-id': metaId,
      style: 'width:100%;height:100%',
    });

    const API_URL = `https://players.brightcove.net/${accountId}/default_default/index.min.js`;
    const BC = await loadScript(opts.apiUrl || API_URL, API_GLOBAL, null, false);
    api = BC(div);
    api.autoplay(element.playing || element.autoplay);

    await promisify(api.ready, api)();
    ready.resolve();
  }

  const meta = {
    get identifier() { return getMetaId(MATCH_SRC, element.src, 4); },
  };

  const methods = {
    name: 'Brightcove',
    version: '1.x.x',
    meta,

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      // Calling this here errors
      // Uncaught TypeError: Cannot read property 'parentNode' of null
      // api.dispose();
    },

    setSrc() {
      // Must return promise here to await ready state.
      return element.load();
    },
  };

  init();

  return methods;
}
