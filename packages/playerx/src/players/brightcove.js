// https://support.brightcove.com/overview-player-api

import { define } from '../define.js';
import { getVideoId } from '../helpers/url.js';
import { createElement } from '../utils/dom.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { uniqueId } from '../utils/utils.js';
import { options } from '../options.js';
export { options };

const API_GLOBAL = 'bc';
const MATCH_URL = /brightcove\.com\/.*?videos\/(\d+)/;

brightcove.canPlay = src => MATCH_URL.test(src);

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
    const videoId = getVideoId(MATCH_URL, element.src);
    const id = uniqueId('bc');

    div = createElement('video-js', {
      id,
      controls: element.controls,
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
      return getVideoId(MATCH_URL, element.src);
    },

    get src() {
      return element.cache('src');
    },

    ready() {
      return ready;
    },

    remove() {
      api.dispose();
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

export const Brightcove = define('player-brightcove', brightcove);
