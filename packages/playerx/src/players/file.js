// https://github.com/video-dev/hls.js
// https://github.com/Dash-Industry-Forum/dash.js

import { define } from '../define.js';
import { createElement } from '../utils/dom.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { options } from '../options.js';
export { options };

const HLS_URL = 'https://cdn.jsdelivr.net/npm/hls.js@0.13.2/dist/hls.min.js';
const HLS_GLOBAL = 'Hls';
const DASH_URL = 'https://cdn.jsdelivr.net/npm/dashjs@3.0.3/dist/dash.all.min.js';
const DASH_GLOBAL = 'dashjs';
const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;
const HLS_EXTENSIONS = /\.m3u8($|\?)/i;
const DASH_EXTENSIONS = /\.mpd($|\?)/i;

const canPlay = file.canPlay = src => {
  if (Array.isArray(src)) {
    for (const item of src) {
      if (typeof item === 'string' && canPlay(item)) {
        return true;
      }
      if (canPlay(item.src)) {
        return true;
      }
    }
    return false;
  }
  return (
    AUDIO_EXTENSIONS.test(src) ||
    VIDEO_EXTENSIONS.test(src) ||
    HLS_EXTENSIONS.test(src) ||
    DASH_EXTENSIONS.test(src)
  );
};

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
      preload: element.preload,
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
      dash.initialize(video, src, autoplay);
      player = {
        name: 'dash.js',
        version: dash.getVersion(),
      };
      return;
    }

    if (Array.isArray(src)) {
      let sources = src;
      video.append(...sources.map(source => {
        const attrs = typeof source === 'string' ? { src: source } : source;
        return createElement('source', attrs);
      }));

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
    get name() { return player.name || ''; },
    get version() { return player.version || ''; },

    get element() {
      return video;
    },

    get api() {
      return video;
    },

    get videoId() {
      return video.currentSrc.split('/').pop();
    },

    ready() {
      return ready;
    },

    remove() {
      reset();
      video.remove();
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

export const File = define('player-file', file);
