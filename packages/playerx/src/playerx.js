import { property, readonly, reflect } from 'swiss';
import * as Events from './constants/events.js';
import { css } from './element.js';
import { createResponsiveStyle, getName, setName } from './helpers.js';
import { options } from './options.js';
import { createVideoShim } from './video-shim.js';
import {
  getStyle,
  extend,
  defaults,
  publicPromise,
  isMethod,
  getProperty,
  getMethod,
  getPropertyDescriptor,
} from './utils.js';

const sheet = getStyle();
sheet.firstChild.data += css`
  player-x {
    display: flex;
    align-items: flex-end;
    position: relative;
    width: 100%;
  }
  player-x::before {
    content: "";
    margin-left: -1px;
    width: 1px;
    height: 0;
    float: left;
    padding-top: 56.25%
  }
  player-x::after {
    content: "";
    display: table;
    clear: both
  }
  player-x plx-media,player-x plx-media>* {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%
  }
`;

const readonlyProps = readonly({
  buffered: undefined,
  currentSrc: '',
  duration: NaN,
  ended: false,
  error: null,
  paused: true,
  readyState: 0,
  videoHeight: 0,
  videoWidth: 0,
  api: undefined, // custom property
  name: undefined, // custom property
  key: undefined, // custom property
  version: undefined, // custom property
});

const reflectProps = reflect({
  aspectRatio: undefined, // custom property
  autoplay: false,
  controls: false,
  height: undefined,
  loop: false,
  muted: false,
  playing: false, // custom property
  playsinline: false,
  preload: undefined,
  src: undefined,
  width: undefined,
});

export const props = {
  ...readonlyProps,
  ...reflectProps,

  currentTime: 0,
  playbackRate: 1,
  volume: 1,

  config: property(undefined, { // custom property
    fromAttribute: (val) => JSON.parse(val),
  }),

  meta: property(undefined, { // custom property
    fromAttribute: (val) => JSON.parse(val),
  }),
};

export const coreMethodNames = ['play', 'pause', 'get'];


/** @typedef { import('./index').Playerx } Playerx */

/**
 * @type {(CE: Class, options: Object) => (element: Playerx) => Object}
 */
export const PlayerxMixin = (CE, { create }) => (element) => {
  console.dir(element);

  element.config = getInlineJSON(element).config || {};
  element.meta = getInlineJSON(element).meta || {};

  // Shortcuts to native DOM event listener methods.
  element.on = element.addEventListener;
  element.off = element.removeEventListener;

  // Store original getProp because it's overridden.
  // This method is used to get data directly from the property cache.
  element.cache = element.getProp;
  element.setCache = element.setProp;

  let player = {};
  let responsiveStyle = createResponsiveStyle(element);
  extend(player, base(element, player), responsiveStyle, override(element, player));

  let elementReady = publicPromise();
  let videoShim = createVideoShim(element);


  async function setProp(name, value, oldValue) {
    element.setCache(name, value);

    if (value !== oldValue) {
      element.fire('prop', {
        name,
        value,
      });

      if (name === 'src') {
        // Give a chance to add more properties on load.
        await Promise.resolve();
        element.load();
      } else {
        playerSet(name);
      }
    }
  }

  function playerSet(name) {
    const value = element.cache(name);
    if (player.set) {
      return player.set(name, value);
    }
  }

  function getProp(name) {
    if (player.get) {
      const value = player.get(name);
      if (value !== undefined && !(value instanceof Promise)) {
        return value;
      }
    }
    return element.cache(name);
  }

  function disconnected() {
    unload();
  }

  function unload() {
    videoShim.unload();
    videoShim.detachEvents(player);

    player.remove();
    player = {};
  }

  async function load() {
    if (!element.cache('src')) return;

    videoShim.unload();

    // The first time if player is null we use the promise defined at the top.
    if (player.api) {
      elementReady = publicPromise();
    }

    element.fire(Events.LOADSRC);

    if (canPlayerLoadSource()) {
      const prevLoad = element.load;

      // If `element.load` is called in the player, re-attach events.
      let initEvents = false;
      // Here to use `element.load()` in players. Preventing an endless loop.
      // When a player calls this it is meant to re-init the player.
      element.load = () => (initEvents = true) && init();

      await playerSet('src');
      element.load = prevLoad;

      await afterLoad(initEvents);
      element.fire(Events.LOADEDSRC);

      return;
    }

    await init();
    await afterLoad(true);
    element.fire(Events.LOADEDSRC);
    element.fire(Events.READY);
  }

  function canPlayerLoadSource() {
    const playerParam = getSrcParam(element.cache('src'), 'player');
    if (playerParam && playerParam !== element.key) {
      return false;
    }
    return player.api && options.players[element.key].canPlay(element.cache('src'));
  }

  async function init() {
    if (player.api) {
      unload();
    }

    let media = element.querySelector('plx-media');
    if (!media) {
      media = document.createElement('plx-media');
      element.insertBefore(media, element.firstChild);
    }

    const mediaContent = media.children[0];

    player = {};
    extend(
      player,
      base(element, player),
      await create(element, mediaContent),
      responsiveStyle,
      override(element, player),
    );
    player.constructor = player.constructor || create;

    // Don't clear to allow progressive enhancement.
    if (mediaContent !== player.element) {
      media.textContent = '';
      media.appendChild(player.element);
    }

    element.fire('media');
  }

  async function afterLoad(initEvents) {
    await player.ready();

    // Set volume before muted, some players (Vimeo) turn off muted if volume is set.
    await playerSet('volume');

    await Promise.all([
      playerSet('muted'),

      // The default value of preload is different for each browser.
      // The spec advises it to be set to metadata.
      player.set('preload', element.cache('preload') || 'metadata'),

      playerSet('playsinline'),
      playerSet('loop'),
    ]);

    if (initEvents) videoShim.attachEvents(player);

    // const autoplay = element.cache('autoplay') || element.cache('playing');
    // await player.set('autoplay', autoplay);

    await videoShim.update();
    elementReady.resolve();
  }

  function fire(name, detail = {}) {
    const event = new CustomEvent(name, { detail });
    element.dispatchEvent(event);
  }

  function ready() {
    return elementReady;
  }

  function supports(method) {
    return player.supports(method);
  }

  const methods = {
    fire,
    load,
    unload,
    disconnected,
    getProp,
    setProp,
    ready,
    supports,
  };

  coreMethodNames.forEach((name) => {
    methods[name] = async function (...args) {
      await videoShim.ready();
      if (player[name]) {
        return player[name](...args);
      }
    };
  });

  return methods;
};

function getInlineJSON(host) {
  const script = host.querySelectorAll(`script[type$="json"]`)[0];
  return (script && JSON.parse(script.textContent)) || {};
}

function base(element, player) {
  return {
    ...flexApi(player),

    unsupported: {},
    supports(method) {
      return !(method in player.unsupported);
    },

    remove: flexMethod(player, 'remove'),
    play: flexMethod(player, 'play'),
    pause: flexMethod(player, 'pause'),

    on(eventName, callback) {
      player.api.on(eventName, callback);
    },

    off(eventName, callback) {
      player.api.off(eventName, callback);
    },

    setPlaying(playing) {
      if (!element.paused && !playing) {
        return player.pause();
      }
      if (element.paused && playing) {
        return player.play();
      }
    },

    getSrc() {
      return element.cache('src');
    },

    getEnded() {
      return element.currentTime > 0 && element.currentTime == element.duration;
    },

    getKey() {
      return player.name && player.name.toLowerCase();
    },
  };
}

function override(element, player) {
  const metadata = {};
  const _override = {
    get meta() {
      return defaults(metadata, element.cache('meta'), player.meta);
    },
  };
  return { _override };
}

function flexMethod(player, name) {
  return function() {
    if (player.api && player.api[name]) return player.api[name]();
    if (player.element && player.element[name]) return player.element[name]();
  };
}

export function flexApi(instance) {
  return {
    /**
     * Set a instance property, try instance interface first, then internal api.
     * @param  {string} name
     * @param {*} value
     * @return {*}
     */
    set(name, value) {
      if (name == null) return;

      let descriptor = getPropertyDescriptor(instance, name);
      if (descriptor && descriptor.set) return (instance[name] = value);

      const method = setName(name);
      if (isMethod(instance, method)) return instance[method](value);

      if (instance.api) {
        descriptor = getPropertyDescriptor(instance.api, name);
        if (descriptor && descriptor.set) return (instance.api[name] = value);

        if (isMethod(instance.api, name)) return instance.api[name](value);
        if (isMethod(instance.api, method)) return instance.api[method](value);
      }

      // In case the element is a native <video> element.
      // Needed for Shaka player, hls.js, dash.js where there are 2 API interfaces;
      // The video element and one specific API interface.
      if (instance.element && instance.element.play) {
        descriptor = getPropertyDescriptor(instance.element, name);
        if (descriptor && descriptor.set) return (instance.element[name] = value);
      }
    },

    /**
     * Get a instance property, try instance interface first, then internal api.
     * @param  {string} name
     * @return {*}
     */
    get(name) {
      if (name == null) return;

      let result;
      if ((result = getProperty(instance._override, name)) !== undefined) return result;

      const method = getName(name);
      if ((result = getProperty(instance, name)) !== undefined) return result;
      if ((result = getMethod(instance, method)) !== undefined) return result;

      if (instance.api) {
        if ((result = getProperty(instance.api, name)) !== undefined) return result;
        if ((result = getMethod(instance.api, name)) !== undefined) return result;
        if ((result = getMethod(instance.api, method)) !== undefined) return result;
      }

      // In case the element is a native <video> element.
      // Needed for Shaka player, hls.js, dash.js where there are 2 API interfaces;
      // The video element and one specific API interface.
      if (instance.element && instance.element.play) {
        if ((result = getProperty(instance.element, name)) !== undefined) return result;
      }
    },
  };
}

function getSrcParam(src, key) {
  const url = Array.isArray(src) ? src[0] : src;
  return url && new URLSearchParams(url.split('?')[1]).get(key);
}

export function getCurrentPlayerConfig(src) {
  const playerParam = getSrcParam(src, 'player');
  if (options.players[playerParam]) {
    return options.players[playerParam];
  }

  for (let key in options.players) {
    const playerConfig = options.players[key];
    if (playerConfig.canPlay(src)) {
      return playerConfig;
    }
  }
  // Fallback to html player.
  return options.players.html;
}
