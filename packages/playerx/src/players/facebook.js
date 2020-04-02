// https://developers.facebook.com/docs/plugins/embedded-video-player/api/

import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { createElement } from '../utils/dom.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { uniqueId } from '../utils/utils.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://connect.facebook.net/en_US/sdk.js';
const API_GLOBAL = 'FB';
const API_GLOBAL_READY = 'fbAsyncInit';
const MATCH_URL = /facebook\.com\/.+/;

facebook.canPlay = src => MATCH_URL.test(src);

export function facebook(element) {
  let api;
  let div;
  let ready;
  let style = createResponsiveStyle(element);

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      url: element.src,
      ...element.config.facebook,
    };
  }

  async function init() {
    ready = publicPromise();

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
        api = msg.instance;
        ready.resolve();
      }
    });
  }

  const eventAliases = {
    pause: 'paused',
    playing: 'startedPlaying',
    ended: 'finishedPlaying',
    bufferstart: 'startedBuffering',
    bufferend: 'finishedBuffering',
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
      div.remove();
    },

    stop() {
      api.seek(0);
      api.pause();
    },

    on(eventName, callback) {
      (callback._listeners || (callback._listeners = {}))[eventName] =
        api.subscribe(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      callback._listeners[eventName].release();
    },

    set src(value) {
      style.update(element);
      element.load();
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

  return extend(style.methods, methods);
}

export const Facebook = define('player-facebook', facebook);
