// https://github.com/video-dev/hls.js

import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
} from '../utils.js';

const HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@0.13.2/dist/hls.min.js';
const HLS_GLOBAL = 'Hls';

export function createPlayer(element) {
  let video;
  let player = {};
  let hls;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      loop: element.loop,
      playsinline: element.playsinline,
      controls: element.controls,
      // The default value is different for each browser.
      // The spec advises it to be set to metadata.
      preload: element.preload || 'metadata',
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

    const Hls = await loadScript(opts.hlsUrl || HLS_URL, HLS_GLOBAL);
    if (Hls.isSupported()) {
      hls = new Hls(element.config.hlsjs);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, () => element.fire('error'));
      hls.loadSource(src);
      player = {
        version: Hls.version,
      };
      return;
    }
  }

  function reset() {
    if (hls) {
      hls.destroy();
      hls = null;
    }

    video.removeAttribute('src');
    video.innerHTML = '';
  }

  const methods = {
    get key() { return 'hlsjs'; },
    get name() { return 'hls.js'; },
    get version() { return player.version || ''; },

    get element() {
      return video;
    },

    get api() {
      return video;
    },

    get videoId() {
      return (video.currentSrc || video.src).split('/').pop();
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

    getSrc() {
      return element.cache('src');
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
