// https://developers.facebook.com/docs/plugins/embedded-video-player/api/

import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { createElement } from '../utils/dom.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { uniqueId } from '../utils/utils.js';

const API_URL = 'https://connect.facebook.net/en_US/sdk.js';
const API_GLOBAL = 'FB';
const API_GLOBAL_READY = 'fbAsyncInit';
const MATCH_URL = /facebook\.com\/.+/;

facebook.canPlay = src => MATCH_URL.test(src);

export function facebook(element, reload) {
  let api;
  let div;
  let ready = publicPromise();
  let style = createResponsiveStyle(element);

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      muted: element.muted,
      loop: element.loop,
      controls: element.controls,
      url: element.src,
      ...element.config.facebook,
    };
  }

  async function init() {
    const options = getOptions();
    const id = uniqueId('fb');

    div = createElement('div', {
      id,
      class: 'fb-video',
      style: 'width:100%;height:100%',
      'data-href': options.url,
      'data-autoplay': '' + options.autoplay,
      'data-allowfullscreen': 'true',
      'data-controls': '' + options.controls,
    });

    const FB = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
    FB.init({
      appId: options.appId,
      version: options.version,
      xfbml: true,
    });

    FB.Event.subscribe('xfbml.ready', msg => {
      if (msg.type === 'video' && msg.id === id) {
        initApi(msg.instance, options);
      }
    });
  }

  function initApi(instance) {
    api = instance;

    // div.querySelector('iframe').setAttribute('allow', 'autoplay; encrypted-media;');

    ready.resolve();
  }

  const eventAliases = {
    pause: 'paused',
    playing: 'startedPlaying',
    ended: 'finishedPlaying',
    bufferstart: 'startedBuffering',
    bufferend: 'finishedBuffering',
  };

  const customEvents = {
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

    remove() {

    },

    stop() {
      api.seek(0);
      api.pause();
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      (callback._listeners || (callback._listeners = {}))[eventName] =
        api.subscribe(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      callback._listeners[eventName].release();
    },

    set src(value) {
      style.update(element);
      reload();
    },

    get currentTime() {
      return api.getCurrentPosition();
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    set controls(value) {
      reload();
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

  return extend(style.methods, methods);
}

export const Facebook = define('player-facebook', facebook);
