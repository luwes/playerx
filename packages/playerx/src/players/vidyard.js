// https://knowledge.vidyard.com/hc/en-us/articles/360019034753

import { define } from '../define.js';
import { getVideoId } from '../helpers/url.js';
import { addCssRule } from '../utils/css.js';
import { createElement } from '../utils/dom.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, promisify } from '../utils/promise.js';
import { clamp } from '../utils/utils.js';
import { createPlayPromise } from '../helpers/video.js';
import { options } from '../options.js';
export { options };

const API_URL = 'https://play.vidyard.com/embed/v4.js';
const API_GLOBAL = 'VidyardV4';
const API_GLOBAL_READY = 'onVidyardAPI';
const MATCH_URL = /vidyard\..*?\/(?:share|watch)\/(\w+)/;

addCssRule(`.vidyard-player-container,.vidyard-player-container>div`, {
  position: 'absolute !important',
  height: '100% !important',
  width: '100% !important',
  padding: '0 !important'
});

/**
 * Returns true if the source can be played by this player.
 * @param  {string} src
 * @return {boolean}
 */
vidyard.canPlay = src => MATCH_URL.test(src);

export function vidyard(element) {
  let api;
  let img;
  let ready;
  let VidyardV4;
  let apiVolume;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      ...element.config.vidyard
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const videoId = getVideoId(MATCH_URL, element.src);

    img = createElement('img', {
      class: 'vidyard-player-embed',
      src: `https://play.vidyard.com/${videoId}.jpg`,
      'data-uuid': videoId,
      'data-v': '4',
      'data-type': 'inline',
      style: 'display:none'
    });

    VidyardV4 = await loadScript(opts.apiUrl || API_URL, API_GLOBAL, API_GLOBAL_READY);
    const renderPromise = VidyardV4.api.renderPlayer(img);

    api = await renderPromise;
    await promisify(api.on, api)('ready');

    api.on('volumeChange', (vol) => (apiVolume = vol));

    ready.resolve();

    opts.autoplay && api.play();
  }

  const eventAliases = {
    volumechange: 'volumeChange',
    ended: 'playerComplete'
  };

  const unsupportedEvents = {
    playing: undefined,
    progress: undefined,
    durationchange: undefined,
    loadstart: undefined,
    loadedmetadata: undefined,
    seeking: undefined,
    seeked: undefined,
    cuechange: undefined,
    ratechange: undefined,
    error: undefined,
    bufferstart: undefined,
    bufferend: undefined,
    resize: undefined,
  };

  const methods = {
    name: 'Vidyard',
    version: '1.x.x',

    get element() {
      return img;
    },

    get api() {
      return api;
    },

    get videoId() {
      return getVideoId(MATCH_URL, element.src);
    },

    get videoTitle() {
      return api.metadata.chapters_attributes[0].video_attributes
        .name;
    },

    ready() {
      return ready;
    },

    remove() {
      return VidyardV4.api.destroyPlayer(api);
    },

    play() {
      // play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
    },

    stop() {
      return api.resetPlayer();
    },

    on(eventName, callback) {
      if (eventName in unsupportedEvents) return;
      api.on(eventAliases[eventName] || eventName, callback);
    },

    off(eventName, callback) {
      api.off(eventAliases[eventName] || eventName, callback);
    },

    setSrc() {
      element.load();
    },

    get duration() {
      return api.metadata.chapters_attributes[0].video_attributes
        .length_in_seconds;
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    set muted(muted) {
      muted ? api.setVolume(0) : api.setVolume(+element.cache('volume'));
    },

    get muted() {
      return apiVolume === 0;
    },

    set volume(volume) {
      if (!element.muted) {
        api.setVolume(clamp(0.001, 1, volume));
      }
    },

    async getVolume() {
      return +element.cache('volume');
    },

    set playbackRate(value) {
      api.setPlaybackSpeed(value);
    }
  };

  init();

  return methods;
}

export const Vidyard = define('player-vidyard', vidyard);
