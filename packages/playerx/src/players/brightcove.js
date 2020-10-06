// https://support.brightcove.com/overview-player-api

import { brightcove as MATCH_SRC } from '../constants/src-regex.js';
import { define } from '../define.js';
import { getVideoId } from '../helpers.js';
import {
  createElement,
  loadScript,
  publicPromise,
  promisify,
  uniqueId,
} from '../utils.js';

const API_GLOBAL = 'bc';

export function brightcove(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      controls: element.controls,
      ...element.config.brightcove,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const videoId = getVideoId(MATCH_SRC, element.src);
    const id = uniqueId('bc');

    div = createElement('video-js', {
      id,
      controls: opts.controls ? '' : null,
      'data-video-id': videoId,
      style: 'width:100%;height:100%',
    });

    const API_URL = `https://players.brightcove.net/${opts.account}/default_default/index.min.js`;
    const BC = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = BC(id);
    api.autoplay(element.playing || element.autoplay);

    await promisify(api.ready, api)();
    ready.resolve();
  }

  const methods = {
    name: 'Brightcove',
    version: '1.x.x',

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoId() {
      return getVideoId(MATCH_SRC, element.src);
    },

    get src() {
      return element.cache('src');
    },

    ready() {
      return ready;
    },

    remove() {
      // Calling this here errors
      // Uncaught TypeError: Cannot read property 'parentNode' of null
      // api.dispose();
    },

    stop() {
      api.pause();
      api.currentTime(0);
    },

    setSrc() {
      element.load();
    },
  };

  init();

  return methods;
}

export const Brightcove = define('plx-brightcove', brightcove);
