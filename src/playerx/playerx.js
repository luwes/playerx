import * as Events from './constants/events.js';
import { createResponsiveStyle, getName, setName } from './helpers.js';
import { options } from './options.js';
import { createVideoShim } from './video-shim.js';
import {
  PlxElement,
  css,
  readonly,
  reflect,
  property,
} from './element.js';
import {
  delay,
  getStyle,
  extend,
  defaults,
  publicPromise,
  isMethod,
  getProperty,
  getMethod,
  getPropertyDescriptor,
  getInlineJSON,
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
    content: '';
    margin-left: -1px;
    width: 1px;
    height: 0;
    float: left;
    padding-top: 56.25%;
  }
  player-x::after {
    content: '';
    display: table;
    clear: both;
  }
  player-x plx-media,
  player-x plx-media > * {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

export const props = {
  ...readonly({
    buffered: undefined,
    currentSrc: '',
    duration: NaN,
    ended: false,
    seeking: false,
    error: null,
    paused: true,
    readyState: 0, // HTMLMediaElement.HAVE_NOTHING
    videoHeight: 0,
    videoWidth: 0,
    api: undefined, // custom property
    name: undefined, // custom property
    key: undefined, // custom property
    version: undefined, // custom property
  }),
  ...reflect({
    aspectRatio: undefined, // custom property
    autoplay: false,
    controls: false,
    height: undefined,
    loop: false,
    muted: false,
    playing: false, // custom property
    playsinline: false,
    poster: undefined,
    preload: undefined,
    src: undefined,
    width: undefined,
  }),

  currentTime: 0,
  playbackRate: 1,
  defaultPlaybackRate: 1,
  volume: 1,

  config: property(undefined, {
    // custom property
    fromAttribute: (val) => JSON.parse(val),
  }),

  meta: property(undefined, {
    // custom property
    fromAttribute: (val) => JSON.parse(val),
  }),
};

export class PlayerxElement extends PlxElement {
  static props = props;

  constructor() {
    super();
    console.dir(this);

    // Store original getProp because it's overridden.
    // This method is used to get data directly from the property cache.
    this.cache = super.getProp;
    this.setCache = super.setProp;

    this._player = {};

    this._elementReady = publicPromise();
    this._videoShim = createVideoShim(this);

    this.config = getInlineJSON(this).config || {};
    this.meta = getInlineJSON(this).meta || {};

    // Shortcuts to native DOM event listener methods.
    this.on = this.addEventListener;
    this.off = this.removeEventListener;

    this._responsiveStyle = createResponsiveStyle(this);
    extend(
      this._player,
      base(this, this._player),
      this._responsiveStyle,
      override(this, this._player)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unload();
  }

  async setProp(name, value, oldValue) {
    this.setCache(name, value);

    if (value !== oldValue) {
      this.fire('prop', {
        name,
        value,
      });

      if (name === 'src') {
        // Give a chance to add more properties on load.
        await delay(0);
        this.load();
      } else {
        this._playerSet(name);
      }
    }
  }

  _playerSet(name) {
    const value = this.cache(name);
    if (this._player.set) {
      return this._player.set(name, value);
    }
  }

  getProp(name) {
    if (this._player.get) {
      const value = this._player.get(name);
      if (value !== undefined && !(value instanceof Promise)) {
        return value;
      }
    }
    return this.cache(name);
  }

  unload() {
    this._videoShim.unload();
    this._videoShim.detachEvents(this._player);

    this._player.remove();
    this._player = {};
  }

  async load() {
    if (!this.cache('src')) return;

    this._videoShim.unload();

    // The first time if player is null we use the promise defined at the top.
    if (this._player.api) {
      this._elementReady = publicPromise();
    }

    this.fire(Events.LOADSRC);

    if (canPlayerLoadSource(this)) {
      const prevLoad = this.load;

      // If `element.load` is called in the player, re-attach events.
      this._initEvents = false;
      // Here to use `element.load()` in players. Preventing an endless loop.
      // When a player calls this it is meant to re-init the player.
      this.load = () => (this._initEvents = true) && this._init();

      await this._playerSet('src');
      this.load = prevLoad;

      await this._afterLoad(this._initEvents);
      this.fire(Events.LOADEDSRC);

      return;
    }

    await this._init();
    await this._afterLoad(true);
    this.fire(Events.LOADEDSRC);
    this.fire(Events.READY);
  }

  async _init() {
    if (this._player.api) {
      this.unload();
    }

    let media = this.querySelector('plx-media');
    if (!media) {
      media = document.createElement('plx-media');
      this.insertBefore(media, this.firstChild);
    }

    const mediaContent = media.children[0];

    const playerConfigKey = getCurrentPlayerConfigKey(this.cache('src'));
    const playerConfig = options.players[playerConfigKey];
    const createPlayer = playerConfig.lazyPlayer
      ? (await playerConfig.lazyPlayer()).createPlayer
      : playerConfig;

    this._player = {};
    extend(
      this._player,
      base(this, this._player),
      await createPlayer(this, mediaContent),
      this._responsiveStyle,
      override(this, this._player)
    );
    this._player.constructor = this._player.constructor || createPlayer;

    // Don't clear to allow progressive enhancement.
    if (mediaContent !== this._player.element) {
      media.textContent = '';
      media.appendChild(this._player.element);
    }

    // Needed for apivideo
    this.fire('media');
  }

  async _afterLoad(initEvents) {
    await this._player.ready();

    // Set volume before muted, some players (Vimeo) turn off muted if volume is set.
    await this._playerSet('volume');

    await Promise.all([
      this._playerSet('muted'),

      // The default value of preload is different for each browser.
      // The spec advises it to be set to metadata.
      this._player.set('preload', this.cache('preload') || 'metadata'),

      this._playerSet('playsinline'),
      this._playerSet('loop'),
    ]);

    if (initEvents) this._videoShim.attachEvents(this._player);

    const autoplay = this.cache('autoplay') || this.cache('playing');
    if (autoplay) {
      this._player.play();
    }

    await this._videoShim.updateProps();
    this._elementReady.resolve();
  }

  async play() {
    await this._videoShim.ready();
    return this._player.play();
  }

  async pause() {
    await this._videoShim.ready();
    return this._player.pause();
  }

  async get(...args) {
    await this._videoShim.ready();
    return this._player.get(...args);
  }

  fire(name, detail = {}) {
    const event = new CustomEvent(name, { detail });
    this.dispatchEvent(event);
  }

  ready() {
    return this._elementReady;
  }

  supports(method) {
    return this._player.supports(method);
  }
}

function canPlayerLoadSource(element) {
  const playerParam = getSrcParam(element.cache('src'), 'player');
  if (playerParam && playerParam !== element.key) {
    return false;
  }
  return (
    element.api && options.players[element.key].canPlay(element.cache('src'))
  );
}

export function getCurrentPlayerConfigKey(src) {
  const playerParam = getSrcParam(src, 'player');
  if (options.players[playerParam]) {
    return playerParam;
  }

  for (let key in options.players) {
    const playerConfig = options.players[key];
    if (playerConfig.canPlay(src)) {
      return key;
    }
  }
  // Fallback to html player.
  return 'html';
}

function getSrcParam(src, key) {
  const url = Array.isArray(src) ? src[0] : src;
  return url && new URLSearchParams(url.split('?')[1]).get(key);
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
      if (player.api.on) {
        player.api.on(eventName, callback);
      } else if (player.api.addEventListener) {
        player.api.addEventListener(eventName, callback);
      }
    },

    off(eventName, callback) {
      if (player.api.off) {
        player.api.off(eventName, callback);
      } else if (player.api.removeEventListener) {
        player.api.removeEventListener(eventName, callback);
      }
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
  return function () {
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
        if (descriptor && descriptor.set)
          return (instance.element[name] = value);
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
      if ((result = getProperty(instance._override, name)) !== undefined)
        return result;

      const method = getName(name);
      if ((result = getProperty(instance, name)) !== undefined) return result;
      if ((result = getMethod(instance, method)) !== undefined) return result;

      if (instance.api) {
        if ((result = getProperty(instance.api, name)) !== undefined)
          return result;
        if ((result = getMethod(instance.api, name)) !== undefined)
          return result;
        if ((result = getMethod(instance.api, method)) !== undefined)
          return result;
      }

      // In case the element is a native <video> element.
      // Needed for Shaka player, hls.js, dash.js where there are 2 API interfaces;
      // The video element and one specific API interface.
      if (instance.element && instance.element.play) {
        if ((result = getProperty(instance.element, name)) !== undefined)
          return result;
      }
    },
  };
}
