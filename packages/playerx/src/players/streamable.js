// https://github.com/vimeo/player.js

import { define } from '../define.js';
import { READY } from '../constants/events.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { createTimeRanges } from '../utils/time-ranges.js';

const EMBED_BASE = 'https://streamable.com/o';
const API_URL = 'https://cdn.embed.ly/player-0.1.0.min.js';
const API_GLOBAL = 'playerjs';
const MATCH_URL = /streamable\.com\/([a-z0-9]+)$/;

streamable.canPlay = src => MATCH_URL.test(src);

export function streamable(element, reload) {
  let api;
  let iframe;
  let ready = publicPromise();
  let style = createResponsiveStyle(element);
  let updateInterval;
  let getVolume;
  let getMuted;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      muted: element.muted,
      loop: element.loop,
      ...element.config.streamable,
    };
  }

  function getVideoId(src) {
    let match;
    return (match = src.match(MATCH_URL)) && match[1];
  }

  async function init() {
    const options = getOptions();
    const videoId = getVideoId(element.src);
    const src = `${EMBED_BASE}/${videoId}`;
    iframe = createEmbedIframe({ src });

    const playerjs = await loadScript(API_URL, API_GLOBAL);
    api = new playerjs.Player(iframe);
    getVolume = promisify(api.getVolume.bind(api));
    getMuted = promisify(api.getMuted.bind(api));

    api.setLoop(options.loop);
    options.muted && api.mute();
    options.autoplay && api.play();

    api.on('buffered', async ({ percent }) => {
      const end = element.duration > 0 ? element.duration * percent : 0;
      element.refresh('buffered', createTimeRanges(0, end));
      element.fire('progress');
    });

    api.on('timeupdate', ({ seconds, duration }) => {
      element.refresh('currentTime', seconds);

      if (element.duration !== duration) {
        element.refresh('duration', duration);
        element.fire('durationchange');
      }
    });

    await promisify(api.on.bind(api))(READY);
    await update();

    ready.resolve();

    clearInterval(updateInterval);
    updateInterval = setInterval(update, 250);
  }

  const eventAliases = {
    playing: 'play',
  };

  const customEvents = {
    progress: undefined,
  };

  const methods = {
    // disable getters because they return promises.
    get: null,

    get element() {
      return iframe;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      clearInterval(updateInterval);
    },

    stop() {
      element.currentTime = 1e9;
      element.play();
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.on(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.off(eventAliases[eventName] || eventName, callback);
    },

    set src(value) {
      style.update(element);
      reload();
    },

    set volume(volume) {
      api.setVolume(volume * 100);
    },

    set muted(muted) {
      muted ? api.mute() : api.unmute();
    },

    set controls(value) {

    },

  };

  function update() {
    return Promise.all([
      updateVolume(),
      updateMuted(),
    ]);
  }

  async function updateVolume() {
    let volume = await getVolume();
    volume = volume / 100;
    if (element.volume !== volume) {
      element.refresh('volume', volume);
      element.fire('volumechange');
    }
  }

  async function updateMuted() {
    let muted = await getMuted();
    if (element.muted !== muted) {
      element.refresh('muted', muted);
      element.fire('volumechange');
    }
  }

  init();

  return extend(style.methods, methods);
}

export const Streamable = define('player-streamable', streamable);
