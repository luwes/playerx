// https://developers.soundcloud.com/docs/api/html5-widget

import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { removeNode } from '../utils/dom.js';
import { omit } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { serialize } from '../utils/url.js';
import { clamp } from '../utils/utils.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { createPlayPromise } from '../helpers/video.js';
import { options } from '../options.js';
export { options };

const EMBED_BASE = 'https://w.soundcloud.com/player';
const API_URL = 'https://w.soundcloud.com/player/api.js';
const API_GLOBAL = 'SC';

export function soundcloud(element) {
  let api;
  let iframe;
  let ready = publicPromise();
  let eventAliases;
  let loadedProgress;

  function getOptions() {
    return {
      auto_play: element.playing || element.autoplay,
      url: element.src,
      ...element.config.soundcloud,
    };
  }

  async function init() {
    const opts = getOptions();
    const src = `${EMBED_BASE}/?${serialize(opts)}`;
    iframe = createEmbedIframe({ src });

    const SC = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    const Events = SC.Widget.Events;
    api = SC.Widget(iframe);

    loadedProgress = 0;
    api.bind(Events.PLAY_PROGRESS, e => {
      loadedProgress = e.loadedProgress;
    });

    eventAliases = {
      play: Events.PLAY,
      pause: Events.PAUSE,
      timeupdate: Events.PLAY_PROGRESS,
      ended: Events.FINISH,
      error: Events.ERROR
    };

    await promisify(api.bind, api)(Events.READY);
    ready.resolve();
  }

  const unsupported = {
    playbackRate: undefined,
  };

  const methods = {
    name: 'SoundCloud',
    version: '1.x.x',
    unsupported,

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
      removeNode(iframe);
    },

    stop() {
      api.seekTo(0);
    },

    on(eventName, callback) {
      api.bind(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      api.unbind(eventAliases[eventName] || eventName, callback);
    },

    play() {
      // play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    async setSrc(src) {
      const loaded = publicPromise();
      api.load(src, omit(['url'], {
        ...getOptions(),
        callback: loaded.resolve
      }));
      return loaded;
    },

    set currentTime(seconds) {
      api.seekTo(seconds * 1000);
    },

    async getCurrentTime() {
      let position = await promisify(api.getPosition, api)();
      return position / 1000;
    },

    set muted(muted) {
      muted ? api.setVolume(0) : api.setVolume(element.cache('volume') * 100);
    },

    async getMuted() {
      return await promisify(api.getVolume, api)() === 0;
    },

    set volume(volume) {
      if (!element.muted) {
        api.setVolume(clamp(0.001, 100, volume * 100));
      }
    },

    async getVolume() {
      let volume = await promisify(api.getVolume, api)();
      return volume > 0.001 ? volume / 100 : +element.cache('volume');
    },

    async getDuration() {
      let { duration } = await promisify(api.getCurrentSound, api)();
      return duration / 1000;
    },

    get buffered() {
      const progress = loadedProgress * element.duration;
      if (progress > 0) {
        return createTimeRanges(0, progress);
      }
      return createTimeRanges();
    },
  };

  init();

  return methods;
}

export const SoundCloud = define('player-soundcloud', soundcloud);
