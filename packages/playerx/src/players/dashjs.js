// https://github.com/Dash-Industry-Forum/dash.js

import { createPlayPromise } from '../helpers.js';
import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  getFileName,
} from '../utils.js';

const DASH_URL = 'https://cdn.jsdelivr.net/npm/dashjs@3.2.2/dist/dash.all.min.js';
const DASH_GLOBAL = 'dashjs';

export function createPlayer(element) {
  let video;
  let api;
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
    api = Dash.MediaPlayer().create();
    api.initialize(video, src, autoplay);
  }

  function reset() {
    if (api) {
      api.reset();
      api = null;
    }

    video.removeAttribute('src');
    video.innerHTML = '';
  }

  const meta = {
    get identifier() { return getFileName(api.getSource()); },
  };

  const methods = {
    key: 'dashjs',
    name: 'dash.js',
    meta,

    get version() { return api.getVersion() || ''; },

    get element() {
      return video;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    play() {
      // dash.js api.play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
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
