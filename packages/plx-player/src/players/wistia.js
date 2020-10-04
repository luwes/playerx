// https://wistia.com/support/developers/player-api

import { wistia as MATCH_SRC } from '../constants/src-regex.js';
import { define } from '../define.js';
import { getVideoId } from '../helpers/url.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { createElement, removeNode } from '../utils/dom.js';
import { createPlayPromise } from '../helpers/video.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://fast.wistia.com/assets/external/E-v1.js';
const API_GLOBAL = 'Wistia';

export function wistia(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      autoPlay: element.playing || element.autoplay,
      muted: element.muted,
      // The default value is different for each browser.
      // The spec advises it to be set to metadata.
      preload: element.preload || 'metadata',
      playsinline: element.playsinline,
      endVideoBehavior: element.loop && 'loop',
      chromeless: !element.controls,
      playButton: element.controls,
      ...element.config.wistia,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const id = getVideoId(MATCH_SRC, element.src);

    div = createElement('div', {
      class: `wistia_embed wistia_async_${id}`,
    });

    const onReadyPromise = publicPromise();
    const onReady = onReadyPromise.resolve;

    await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    window._wq.push({
      id,
      onReady,
      options: opts,
    });

    api = await onReadyPromise;

    api.elem().addEventListener('play', () => {
      element.fire('play');
    });

    api.elem().addEventListener('durationchange', () => {
      element.fire('durationchange');
    });

    ready.resolve();
  }

  const eventAliases = {
    playing: 'play',
    ratechange: 'playbackratechange',
    timeupdate: 'timechange',
    ended: 'end',
  };

  const customEvents = {
    play: undefined,
    durationchange: undefined,
  };

  const methods = {
    name: 'Wistia',
    version: '1.x.x',

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoId() {
      return api.hashedId();
    },

    get videoTitle() {
      return api.name();
    },

    get videoWidth() {
      return api.elem().videoWidth;
    },

    get videoHeight() {
      return api.elem().videoHeight;
    },

    get error() {
      return api.elem().error;
    },

    ready() {
      return ready;
    },

    play() {
      // wistia.play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    getPaused() {
      // Possible values are beforeplay, playing, paused and ended.
      return api.state() !== 'playing';
    },

    stop() {
      api.rebuild();
    },

    remove() {
      api.remove();
      removeNode(div);
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.bind(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.unbind(eventAliases[eventName] || eventName, callback);
    },

    set src(src) {
      element.load();

      // `api.replaceWith` works but does strange things with resizing ;(
      // api.replaceWith(getVideoId(MATCH_SRC, src), getOptions());
    },

    set currentTime(seconds) {
      api.time(seconds);
    },

    get currentTime() {
      return api.time();
    },

    get buffered() {
      return api.elem().buffered;
    },

    set controls(controls) {
      api.bigPlayButtonEnabled(controls);
      controls ? api.releaseChromeless() : api.requestChromeless();
    },

    set muted(muted) {
      muted ? api.mute() : api.unmute();
    },

    get muted() {
      return api.isMuted();
    },
  };

  init();

  return methods;
}

export const Vimeo = define('plx-wistia', wistia);
