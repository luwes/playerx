import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { extend, omit } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { serialize } from '../utils/url.js';
import { once, clamp } from '../utils/utils.js';
import { createTimeRanges } from '../utils/time-ranges.js';

const EMBED_BASE = 'https://w.soundcloud.com/player';
const API_URL = 'https://w.soundcloud.com/player/api.js';
const API_GLOBAL = 'SC';
const MATCH_URL = /(soundcloud\.com|snd\.sc)\/.+$/;

soundcloud.canPlay = src => MATCH_URL.test(src);

export function soundcloud(element) {
  let api;
  let iframe;
  let firePlaying;
  let ready = publicPromise();
  let style = createResponsiveStyle(element);
  let eventAliases;
  let updateInterval;
  let progress;
  let buffered = createTimeRanges([]);
  let getCurrentSound;
  let getVolume;

  function getOptions() {
    return {
      ...element.config.soundcloud,
      auto_play: element.playing || element.autoplay,
      url: element.src,
    };
  }

  async function init() {
    const options = getOptions();
    const src = `${EMBED_BASE}/?${serialize(options)}`;
    iframe = createEmbedIframe({ src });

    const SC = await loadScript(API_URL, API_GLOBAL);
    const Events = SC.Widget.Events;
    api = SC.Widget(iframe);
    progress = 0;
    getVolume = promisify(api.getVolume.bind(api));
    getCurrentSound = promisify(api.getCurrentSound.bind(api));

    api.bind(Events.PLAY, () => {
      firePlaying = once(() => element.fire('playing'));
    });

    api.bind(Events.PLAY_PROGRESS, e => {
      firePlaying();
      element.refresh('currentTime', e.currentPosition / 1000);

      const loaded = e.loadedProgress;
      if (progress !== loaded) {
        if (!buffered[0]) buffered[0] = [0];

        buffered[0][1] = loaded * element.duration;
        element.refresh('buffered', buffered);

        progress = loaded;
        element.fire('progress');
      }
    });

    eventAliases = {
      play: Events.PLAY,
      pause: Events.PAUSE,
      timeupdate: Events.PLAY_PROGRESS,
      ended: Events.FINISH,
      error: Events.ERROR
    };

    await promisify(api.bind.bind(api))(Events.READY);
    await update();
    methods.muted = element.props.muted;

    ready.resolve();

    clearInterval(updateInterval);
    updateInterval = setInterval(update, 250);
  }

  const customEvents = {
    playing: undefined,
  };

  const methods = {
    // disable getters because they need callbacks.
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

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.bind(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.unbind(eventAliases[eventName] || eventName, callback);
    },

    set src(src) {
      style.update(element);
      api.load(src, omit(['url'], {
        ...getOptions(),
        callback: async () => {
          await update();
          methods.muted = element.props.muted;
        }
      }));
    },

    set currentTime(seconds) {
      api.seekTo(seconds * 1000);
    },

    set muted(muted) {
      muted ? api.setVolume(0) : api.setVolume(element.props.volume * 100);
      element.fire('volumechange');
    },

    set volume(volume) {
      if (!element.muted) {
        api.setVolume(clamp(0.001, 100, volume * 100));
      }
    },
  };

  function update() {
    return Promise.all([
      updateVolume(),
      updateDuration()
    ]);
  }

  async function updateVolume() {
    let volume = await getVolume();
    volume = volume / 100;
    if (element.volume !== volume && volume >= 0.001) {
      element.refresh('volume', volume > 0.001 ? volume : 0);
      element.fire('volumechange');
    }
  }

  async function updateDuration() {
    let { duration } = await getCurrentSound();
    duration = duration / 1000;
    if (element.duration !== duration) {
      element.refresh('duration', duration);
      element.fire('durationchange');
    }
  }

  init();

  return extend(style.methods, methods);
}

export const SoundCloud = define('player-soundcloud', soundcloud);
