// https://github.com/video-dev/hls.js
// https://github.com/Dash-Industry-Forum/dash.js

import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
} from '../utils.js';

const DASH_URL = 'https://cdn.jsdelivr.net/npm/dashjs@3.2.2/dist/dash.all.min.js';
const DASH_GLOBAL = 'dashjs';

export function createPlayer(element) {
  let video;
  let player = {};
  let dash;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.dashjs,
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

    const Dash = await loadScript(opts.dashUrl || DASH_URL, DASH_GLOBAL);
    dash = Dash.MediaPlayer().create();
    dash.on('error', () => element.fire('error'));
    dash.initialize(video, src, autoplay);
    player = {
      version: dash.getVersion(),
    };
  }

  function reset() {
    if (dash) {
      dash.reset();
      dash = null;
    }

    video.removeAttribute('src');
    video.innerHTML = '';
  }

  const methods = {
    key: 'dashjs',
    name: 'dash.js',
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
