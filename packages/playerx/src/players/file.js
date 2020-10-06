// https://github.com/video-dev/hls.js
// https://github.com/Dash-Industry-Forum/dash.js

import { HLS_EXTENSIONS, DASH_EXTENSIONS } from '../constants/src-regex.js';
import { define } from '../define.js';
import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  promisify,
} from '../utils.js';

const HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@0.13.2/dist/hls.min.js';
const HLS_GLOBAL = 'Hls';
const DASH_URL = 'https://cdn.jsdelivr.net/npm/dashjs@3.0.3/dist/dash.all.min.js';
const DASH_GLOBAL = 'dashjs';

function shouldUseHLS(src) {
  return HLS_EXTENSIONS.test(src);
}

function shouldUseDash(src) {
  return DASH_EXTENSIONS.test(src);
}

export function file(element) {
  let video;
  let player = {};
  let hls;
  let dash;
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
      ...element.config.file,
    };
  }

  async function init() {
    ready = publicPromise();
    video = createElement('video');

    await load(getOptions());
    ready.resolve();
  }

  async function load(opts) {
    const { src, autoplay } = opts;
    delete opts.src;

    reset();
    Object.assign(video, opts);

    if (shouldUseHLS(src)) {
      const Hls = await loadScript(opts.hlsUrl || HLS_URL, HLS_GLOBAL);
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, () => element.fire('error'));
        hls.loadSource(src);
        player = {
          name: 'hls.js',
          version: Hls.version,
        };
        return;
      }
    }

    if (shouldUseDash(src)) {
      const Dash = await loadScript(opts.dashUrl || DASH_URL, DASH_GLOBAL);
      dash = Dash.MediaPlayer().create();
      dash.on('error', () => element.fire('error'));
      const sourceInit = promisify(dash.on, dash)('sourceInitialized');
      dash.initialize(video, src, autoplay);
      player = {
        name: 'dash.js',
        version: dash.getVersion(),
      };
      await sourceInit;
      return;
    }

    if (Array.isArray(src)) {
      let sources = src;
      sources.map(source => {
        const attrs = typeof source === 'string' ? { src: source } : source;
        video.appendChild(createElement('source', attrs));
      });
      video.load();
    } else {
      video.src = src;
    }

    player = {
      name: 'html',
      version: '5',
    };
  }

  function reset() {
    if (dash) {
      dash.reset();
      dash = null;
    }

    if (hls) {
      hls.destroy();
      hls = null;
    }

    video.removeAttribute('src');
    video.innerHTML = '';
  }

  const methods = {
    get key() { return 'file'; },
    get name() { return player.name || ''; },
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

export const File = define('plx-file', file);
