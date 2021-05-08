// https://shaka-player-demo.appspot.com/docs/api/index.html

import {
  createElement,
  loadScript,
  publicPromise,
} from '../utils.js';

const API_GLOBAL = 'shaka';
const version = '3.1.0';

export function createPlayer(element) {
  let api;
  let video;
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
    video = createElement('video');

    const opts = getOptions();
    const { src } = opts;
    delete opts.src;
    Object.assign(video, opts);

    const API_URL = `https://cdn.jsdelivr.net/npm/shaka-player@${version}/dist/shaka-player.compiled.js`;
    const shaka = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new shaka.Player(video);
    await api.load(src);

    ready.resolve();
  }

  const methods = {
    name: 'Shaka Player',
    key: 'shakaplayer',
    version,

    get element() {
      return video;
    },

    get api() {
      return api;
    },

    get videoId() {
      return (video.currentSrc || video.src).split('/').pop();
    },

    get src() {
      return element.cache('src');
    },

    setSrc(src) {
      // Must return promise here to await ready state.
      return api.load(src);
    },

    ready() {
      return ready;
    },

    on(eventName, callback) {
      api.addEventListener(eventName, callback);
    },

    off(eventName, callback) {
      api.removeEventListener(eventName, callback);
    },

    remove() {
      api.destroy();
    },

    stop() {
      api.unload();
    },
  };

  init();

  return methods;
}
