// https://knowledge.vidyard.com/hc/en-us/articles/360019034753

import { define } from '../define.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { addCssRule } from '../utils/css.js';
import { createElement } from '../utils/dom.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { clamp } from '../utils/utils.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://play.vidyard.com/embed/v4.js';
const API_GLOBAL = 'VidyardV4';
const API_GLOBAL_READY = 'onVidyardAPI';
const MATCH_URL = /vidyard\..*?\/(?:share|watch)\/(\w+)/;

vidyard.canPlay = src => MATCH_URL.test(src);

export function vidyard(element) {
  let api;
  let img;
  let ready;
  let style = createResponsiveStyle(element);
  let VidyardV4;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      ...element.config.vidyard
    };
  }

  function getVideoId(src) {
    let match;
    return (match = src.match(MATCH_URL)) && match[1];
  }

  async function init() {
    ready = publicPromise();

    const options = getOptions();
    const videoId = getVideoId(element.src);

    img = createElement('img', {
      class: 'vidyard-player-embed',
      src: `https://play.vidyard.com/${videoId}.jpg`,
      'data-uuid': videoId,
      'data-v': '4',
      'data-type': 'inline',
      style: 'display:none'
    });

    VidyardV4 = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
    const renderPromise = VidyardV4.api.renderPlayer(img);

    let selector = `player-x[src="${element.src}"] > div`;
    addCssRule(selector, {
      position: 'absolute !important',
      height: '100% !important'
    });
    addCssRule(`${selector} > div`, {
      position: 'absolute !important',
      height: '100% !important',
      width: '100% !important',
      padding: '0 !important'
    });

    api = await renderPromise;
    await promisify(api.on, api)('ready');

    ready.resolve();

    options.autoplay && api.play();
  }

  const eventAliases = {
    volumechange: 'volumeChange',
    ended: 'playerComplete'
  };

  const customEvents = {};

  const methods = {
    get element() {
      return img;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      VidyardV4.api.destroyPlayer(api);
    },

    stop() {
      return api.resetPlayer();
    },

    on(eventName, callback) {
      if (eventName in customEvents) return;
      api.on(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      if (eventName in customEvents) return;
      api.off(eventAliases[eventName] || eventName, callback);
    },

    setSrc() {
      style.update(element);
      element.load();
    },

    setControls() {},

    get duration() {
      return api.metadata.chapters_attributes[0].video_attributes
        .length_in_seconds;
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    set muted(muted) {
      muted ? api.setVolume(0) : api.setVolume(element.props.volume);
    },

    async getMuted() {
      return +element.props.volume === 0;
    },

    set volume(volume) {
      if (!element.muted) {
        api.setVolume(clamp(0.001, 1, volume));
      }
    },

    async getVolume() {
      return +element.props.volume;
    },

    set playbackRate(value) {
      api.setPlaybackSpeed(value);
    }
  };

  init();

  return extend(style.methods, methods);
}

export const Vidyard = define('player-vidyard', vidyard);
