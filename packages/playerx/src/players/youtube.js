// https://developers.google.com/youtube/iframe_api_reference

import { youtube as MATCH_SRC } from '../constants/src-regex.js';
import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { PlayerError } from '../helpers/error.js';
import { getVideoId } from '../helpers/url.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise, delay } from '../utils/promise.js';
import { serialize, boolToBinary } from '../utils/url.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { createPlayPromise } from '../helpers/video.js';
import { options } from '../options.js';
export { options };

const EMBED_BASE = 'https://www.youtube.com/embed';
const API_URL = 'https://www.youtube.com/iframe_api';
const API_GLOBAL = 'YT';
const API_GLOBAL_READY = 'onYouTubeIframeAPIReady';

export function youtube(element) {
  let api;
  let iframe;
  let ready;
  let filterEventByData;
  let YT;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      playsinline: element.playsinline,
      controls: element.controls,
      mute: element.muted,
      origin: location.origin,
      enablejsapi: 1,
      ...element.config.youtube,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const videoId = getVideoId(MATCH_SRC, element.src);
    const src = `${EMBED_BASE}/${videoId}?${serialize(boolToBinary(opts))}`;
    iframe = createEmbedIframe({ src });

    YT = await loadScript(opts.apiUrl || API_URL, API_GLOBAL, API_GLOBAL_READY);
    api = new YT.Player(iframe, {
      events: {
        onReady: ready.resolve,
        onError
      }
    });

    filterEventByData = {
      loadstart: YT.PlayerState.UNSTARTED,
      loadedmetadata: YT.PlayerState.CUED,
      playing: YT.PlayerState.PLAYING,
      pause: YT.PlayerState.PAUSED,
      ended: YT.PlayerState.ENDED,
      bufferstart: YT.PlayerState.BUFFERING,
      bufferend: YT.PlayerState.PLAYING,
    };

    await ready;
  }

  function onError(event) {
    element.setCache('error', new PlayerError(event.data));
  }

  const eventAliases = {
    ready: 'onReady',
    ratechange: 'onPlaybackRateChange',
    error: 'onError',
    loadedmetadata: 'onStateChange',
    loadstart: 'onStateChange',
    playing: 'onStateChange',
    pause: 'onStateChange',
    ended: 'onStateChange',
    bufferstart: 'onStateChange',
    bufferend: 'onStateChange',
    timeupdate: 'onVideoProgress',
    volumechange: 'onVolumeChange',
  };

  const heightMap = {
    tiny: 144,
    small: 240,
    medium: 360,
    large: 480,
    hd720: 720,
    hd1080: 1080,
    hd1440: 1440,
    hd2160: 2160,
    highres: 2160,
  };

  const methods = {
    name: 'YouTube',
    version: '1.x.x',

    get element() {
      return iframe;
    },

    get api() {
      return api;
    },

    get videoId() {
      return getVideoId(MATCH_SRC, element.src);
    },

    get videoTitle() {
      return api.getVideoData().title;
    },

    get videoWidth() {
      let value = heightMap[api.getPlaybackQuality()];
      const ratio = element.clientHeight / element.clientWidth;
      if (ratio < 1) {
        value /= ratio;
      }
      return value;
    },

    get videoHeight() {
      let value = heightMap[api.getPlaybackQuality()];
      const ratio = element.clientHeight / element.clientWidth;
      if (ratio > 1) {
        value *= ratio;
      }
      return value;
    },

    ready() {
      return ready;
    },

    remove() {
      api.destroy();
    },

    play() {
      // yt.playVideo doesn't return a play promise.
      api.playVideo();
      return createPlayPromise(element);
    },

    pause() {
      return api.pauseVideo();
    },

    async stop() {
      element.pause();
      element.currentTime = 0;
      await delay(60); // add small delay for async call completion

      api.stopVideo();
    },

    on(eventName, callback) {
      const listener = ({ data }) => {
        let eventId = filterEventByData[eventName];
        if (eventId == null || data === eventId) {
          callback();
        }
      };
      (callback._listeners || (callback._listeners = {}))[eventName] = listener;
      api.addEventListener(eventAliases[eventName] || eventName, listener);
    },

    off(eventName, callback) {
      api.removeEventListener(
        eventAliases[eventName] || eventName,
        callback._listeners[eventName]
      );
    },

    set src(src) {
      element.load();

      // `api.cueVideoById` works but `api.getDuration()` is never updated ;(
      // api.cueVideoById(getVideoId(MATCH_SRC, element.src));
    },

    set controls(value) {
      element.load();
    },

    set volume(volume) {
      api.setVolume(volume * 100);
    },

    get volume() {
      return api.getVolume() / 100;
    },

    set muted(muted) {
      muted ? api.mute() : api.unMute();
    },

    get muted() {
      return api.isMuted();
    },

    set currentTime(seconds) {
      api.seekTo(seconds);
      if (!element.playing) {
        element.pause();
      }
    },

    get buffered() {
      const progress = api.getVideoLoadedFraction() * api.getDuration();
      if (progress > 0) {
        return createTimeRanges(0, progress);
      }
      return createTimeRanges();
    },
  };

  init();

  return methods;
}

export const YouTube = define('plx-youtube', youtube);
