// https://github.com/video-dev/hls.js

import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  getFileName,
} from '../utils.js';

const HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@0.13.2/dist/hls.min.js';
const HLS_GLOBAL = 'Hls';

export function createPlayer(element) {
  let video;
  let Hls;
  let api;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.hlsjs,
    };
  }

  async function init() {
    ready = publicPromise();
    video = createElement('video');

    await load(getOptions());
    ready.resolve();
  }

  async function load(opts) {
    const { src } = opts;
    delete opts.src;

    reset();
    Object.assign(video, opts);

    Hls = await loadScript(opts.hlsUrl || HLS_URL, HLS_GLOBAL);
    if (Hls.isSupported()) {
      api = new Hls(element.config.hlsjs);
      api.attachMedia(video);
      api.on(Hls.Events.ERROR, () => element.fire('error'));
      api.loadSource(src);
    }
  }

  function reset() {
    if (api) {
      api.destroy();
      api = null;
    }

    video.removeAttribute('src');
    video.innerHTML = '';
  }

  const meta = {
    get identifier() { return getFileName(video.currentSrc || video.src); },
  };

  const methods = {
    key: 'hlsjs',
    name: 'hls.js',
    meta,

    get version() { return Hls.version || ''; },

    get element() {
      return video;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      reset();
      removeNode(video);
    },

    on(eventName, callback) {
      video.addEventListener(eventName, callback);
    },

    off(eventName, callback) {
      video.removeEventListener(eventName, callback);
    },

    async setSrc() {
      ready = publicPromise();

      await load(getOptions());
      ready.resolve();
    },
  };

  init();

  return methods;
}
