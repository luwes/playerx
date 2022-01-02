// https://github.com/muxinc/elements/tree/main/packages/mux-video

import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  getFileName,
} from '../utils.js';

const API_URL = 'https://cdn.jsdelivr.net/npm/@mux-elements/mux-video@0.2.0/dist/index.js';

export function createPlayer(element) {
  let video;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.muxvideo,
    };
  }

  async function init() {
    ready = publicPromise();
    video = createElement('mux-video');

    await load(getOptions());

    await customElements.whenDefined('mux-video');
    video.hls.config.maxMaxBufferLength = 6;

    ready.resolve();
  }

  async function load(opts) {
    reset();

    await loadScript(opts.apiUrl || API_URL);
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

    get version() { return '0.2.0'; },

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

    async setSrc() {
      ready = publicPromise();
      await load(getOptions());
      ready.resolve();
    },
  };

  init();

  return methods;
}
