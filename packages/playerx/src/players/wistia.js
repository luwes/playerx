import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { createElement } from '../utils/dom.js';

const API_URL = 'https://fast.wistia.com/assets/external/E-v1.js';
const API_GLOBAL = 'Wistia';
const MATCH_URL = /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/;

wistia.canPlay = src => MATCH_URL.test(src);

export function wistia(element, reload) {
  let api;
  let div;
  let ready = publicPromise();
  let style = createResponsiveStyle(element, 'div');

  function getOptions() {
    return {
      ...element.config.wistia,
      autoPlay: element.playing || element.autoplay,
      muted: element.muted,
      playsinline: element.playsinline,
      endVideoBehavior: element.loop && 'loop',
      chromeless: !element.controls,
      controlsVisibleOnLoad: element.controls,
    };
  }

  function getVideoId(src) {
    let match;
    return (match = src.match(MATCH_URL)) && match[1];
  }

  async function init() {
    const options = getOptions();
    const id = getVideoId(element.src);

    div = createElement('div', {
      className: `wistia_embed wistia_async_${id}`,
    });

    const onReadyPromise = publicPromise();
    const onReady = onReadyPromise.resolve;

    await loadScript(API_URL, API_GLOBAL);
    window._wq.push({
      id,
      options,
      onReady
    });

    api = await onReadyPromise;

    api.bind('end', () => {
      if (element.loop) {
        element.play();
        return;
      }
      element.fire('ended');
    });

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
  };

  const customEvents = {
    play: undefined,
    ended: undefined,
    durationchange: undefined,
  };

  const methods = {

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    stop() {
      api.rebuild();
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

      (async () => {
        await reload();
        element.fire('durationchange');
      })();

      // `api.replaceWith` works but does strange things with resizing ;(
      // api.replaceWith(getVideoId(src), getOptions());
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

  return extend(style.methods, methods);
}

export const Vimeo = define('player-wistia', wistia);
