// https://docs.videojs.com/

import {
  createElement,
  loadScript,
  publicPromise,
  promisify,
  uniqueId,
} from '../utils.js';

const API_GLOBAL = 'videojs';
const version = '7.11.8';

export function createPlayer(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.videojs,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const id = uniqueId('vjs');

    document.head.appendChild(createElement('link', {
      href: `https://cdn.jsdelivr.net/npm/video.js@${version}/dist/video-js.min.css`,
      rel: 'stylesheet',
    }));

    div = createElement('video-js', {
      id,
      autoplay: opts.autoplay ? '' : null,
      controls: opts.controls ? '' : null,
      style: 'width:100%;height:100%',
    });
    div.appendChild(createElement('source', {
      src: opts.src,
    }));

    const API_URL = `https://cdn.jsdelivr.net/npm/video.js@${version}/dist/video.min.js`;
    const videojs = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = videojs(div);

    await promisify(api.ready, api)();
    ready.resolve();
  }

  const methods = {
    name: 'video.js',
    key: 'videojs',
    version,

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoId() {
      return (api.currentSrc() || api.src()).split('/').pop();
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
      // Must return promise here to await ready state.
      return element.load();
    },
  };

  init();

  return methods;
}
