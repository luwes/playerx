// https://shaka-player-demo.appspot.com/docs/api/index.html

import {
  createElement,
  loadScript,
  publicPromise,
  getFileName,
} from '../utils.js';

const API_GLOBAL = 'shaka';
const version = '3.1.0';

export function createPlayer(element) {
  let api;
  let video;
  let ready;
  let shaka;

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
    shaka = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new shaka.Player(video);
    await api.load(src);

    ready.resolve();
  }

  const methods = {
    name: 'Shaka Player',
    key: 'shakaplayer',
    get version() { return shaka.Player.version || ''; },

    get element() {
      return video;
    },

    get api() {
      return api;
    },

    get videoId() {
      return getFileName(video.currentSrc || video.src);
    },

    setSrc(src) {
      // Must return promise here to await ready state.
      return api.load(src);
    },

    ready() {
      return ready;
    },

    on(eventName, callback, options) {
      video.addEventListener(eventName, callback, options);
    },

    off(eventName, callback, options) {
      video.removeEventListener(eventName, callback, options);
    },

    remove() {
      api.destroy();
    },
  };

  init();

  return methods;
}
