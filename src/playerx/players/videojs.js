// https://docs.videojs.com/

import {
  createElement,
  loadScript,
  publicPromise,
  promisify,
  uniqueId,
  getFileName,
} from '../utils.js';

const API_GLOBAL = 'videojs';
const version = '7.11.8';

export function createPlayer(element) {
  let api;
  let div;
  let ready;
  let videojs;

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
    videojs = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = videojs(div);

    await promisify(api.ready, api)();
    ready.resolve();
  }

  const meta = {
    get identifier() { return getFileName(api.currentSrc() || api.src()); },
  };

  const methods = {
    name: 'video.js',
    key: 'videojs',
    meta,

    get version() { return videojs.VERSION || ''; },

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
      api.dispose();
    },

    setSrc() {
      // Must return promise here to await ready state.
      return element.load();
    },
  };

  init();

  return methods;
}
