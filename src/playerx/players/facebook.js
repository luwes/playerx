// https://developers.facebook.com/docs/plugins/embedded-video-player/api/

import { facebook as MATCH_SRC } from '../constants/src-regex.js';
import { getMetaId, createPlayPromise, allow } from '../helpers.js';
import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  uniqueId,
} from '../utils.js';

const API_URL = 'https://connect.facebook.net/en_US/sdk.js';
const API_GLOBAL = 'FB';
const API_GLOBAL_READY = 'fbAsyncInit';

export function createPlayer(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      url: element.src,
      // appId: '',
      version: 'v3.2',
      ...element.config.facebook,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const id = uniqueId('fb');

    div = createElement('div', {
      id,
      class: 'fb-video',
      'data-href': opts.url,
      'data-autoplay': '' + opts.autoplay,
      'data-allowfullscreen': 'true',
      'data-controls': '' + opts.controls,
      'data-width': '1920',
      'data-height': '1080',
    });

    const FB = await loadScript(opts.apiUrl || API_URL, API_GLOBAL, API_GLOBAL_READY);
    FB.init({
      appId: opts.appId,
      version: opts.version,
      xfbml: true,
    });

    FB.Event.subscribe('xfbml.ready', msg => {
      if (msg.type === 'video' && msg.id === id) {
        div.querySelector('iframe').allow = allow;
        api = msg.instance;
        ready.resolve();
      }
    });
  }

  const eventAliases = {
    pause: 'paused',
    play: 'startedPlaying',
    ended: 'finishedPlaying',
    bufferstart: 'startedBuffering',
    bufferend: 'finishedBuffering',
  };

  const unsupported = {
    playbackRate: undefined,
  };

  const meta = {
    get identifier() { return getMetaId(MATCH_SRC, element.src); },
  };

  const methods = {
    name: 'Facebook',
    version: '1.x.x',
    unsupported,
    meta,

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      removeNode(div);
    },

    play() {
      // play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    on(eventName, callback) {
      (callback._listeners || (callback._listeners = {}))[eventName] =
        api.subscribe(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      callback._listeners[eventName].release();
    },

    setSrc() {
      // Must return promise here to await ready state.
      return element.load();
    },

    set controls(value) {
      element.load();
    },

    get currentTime() {
      return api.getCurrentPosition();
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    set volume(volume) {
      api.setVolume(+volume);
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
