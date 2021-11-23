// https://github.com/muxinc/elements/tree/main/packages/mux-video

import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  getFileName,
} from '../utils.js';

const MUX_VIDEO_URL = 'https://unpkg.com/@mux-elements/mux-video@0.1.6/dist/index.js';

export function createPlayer(element) {
  let video;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.mux,
    };
  }

  async function init() {
    ready = publicPromise();
    video = createElement('mux-video');

    await load(getOptions());
    ready.resolve();
  }

  async function load(opts) {
    reset();

    await loadScript(opts.muxVideoUrl || MUX_VIDEO_URL);
    Object.assign(video, opts);
  }

  function reset() {
    video.removeAttribute('src');
    video.innerHTML = '';
  }

  const meta = {
    get identifier() { return getFileName(video.currentSrc || video.src); },
  };

  const methods = {
    key: 'muxvideo',
    name: 'MUX Video',
    meta,

    get version() { return '0.1.6'; },

    get element() {
      return video;
    },

    get api() {
      return video;
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
