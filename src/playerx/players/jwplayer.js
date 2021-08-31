// https://developer.jwplayer.com/jwplayer/docs/jw8-javascript-api-reference

import { jwplayer as MATCH_SRC } from '../constants/src-regex.js';
import { getMetaId, createPlayPromise, PlayerError } from '../helpers.js';
import {
  createElement,
  removeNode,
  loadScript,
  publicPromise,
  promisify,
  requestJson,
  createTimeRanges,
} from '../utils.js';

const API_URL = 'https://ssl.p.jwpcdn.com/player/v/8.12.5/jwplayer.js';
const API_GLOBAL = 'jwplayer';

export function createPlayer(element) {
  let api;
  let div;
  let ready;

  function getOptions() {
    return {
      autostart: element.playing || element.autoplay,
      controls: element.controls,
      // The default value is different for each browser.
      // The spec advises it to be set to metadata.
      preload: element.preload || 'metadata',
      // player: '', // Via https://content.jwplatform.com/libraries/{player_id}.js
      // key: '',         // or https://ssl.p.jwpcdn.com/player/v/8.12.5/jwplayer.js
      ...element.config.jwplayer,
    };
  }

  async function getMedia(id) {
    const mediaUrl = `https://cdn.jwplayer.com/v2/media/${id}`;
    return await requestJson(mediaUrl);
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    div = createElement('div');

    const playerUrl = `https://content.jwplatform.com/libraries/${opts.player}.js`;
    const scriptUrl = opts.key ? opts.apiUrl || API_URL : playerUrl;
    const JW = await loadScript(scriptUrl, API_GLOBAL);
    const id = getMetaId(MATCH_SRC, element.src);
    const media = id ? await getMedia(id) : { file: element.src };
    api = JW(div).setup({
      width: '100%',
      height: '100%',
      ...media,
      ...opts,
    });

    api.on('error', onError);

    await promisify(api.on, api)('ready');
    ready.resolve();
  }

  function onError({ code, message }) {
    element.setCache('error', new PlayerError(code, message));
  }

  const eventAliases = {
    ended: 'complete',
    playing: 'play',
    play: 'beforePlay',
    ratechange: 'playbackRateChanged',
    timeupdate: 'time',
  };

  const customEvents = {
    ready: undefined,
  };

  const meta = {
    get identifier() { return getMetaId(MATCH_SRC, element.src); },
    get name() { return api.getPlaylistItem().title; },
  };

  const methods = {
    name: 'JWPlayer',
    version: '8.x.x',
    meta,

    get element() {
      return div;
    },

    get api() {
      return api;
    },

    get videoWidth() {
      const quality = api.getVisualQuality();
      return quality ? quality.level.width : undefined;
    },

    get videoHeight() {
      const quality = api.getVisualQuality();
      return quality ? quality.level.height : undefined;
    },

    ready() {
      return ready;
    },

    remove() {
      api.remove();
      removeNode(div);
    },

    play() {
      // jwplayer.play doesn't return a play promise.
      api.play();
      return createPlayPromise(element);
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
      // Must return promise here to await ready state.
      return element.load();
    },

    set currentTime(seconds) {
      api.seek(seconds);
    },

    get currentTime() {
      return api.getPosition();
    },

    set volume(volume) {
      api.setVolume(volume * 100);
    },

    get volume() {
      return api.getVolume() / 100;
    },

    set muted(muted) {
      api.setMute(muted);
    },

    get muted() {
      return api.getMute();
    },

    set loop(repeat) {
      api.setConfig({ repeat });
    },

    get loop() {
      return api.getConfig().repeat;
    },

    getBuffered() {
      return createTimeRanges(0, (api.getBuffer() / 100) * api.getDuration());
    },
  };

  init();

  return methods;
}
