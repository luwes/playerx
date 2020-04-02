// https://developers.google.com/youtube/iframe_api_reference

import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { serialize, boolToBinary } from '../utils/url.js';
import { createTimeRanges } from '../utils/time-ranges.js';
import { options } from '../options.js';
export { options };

const EMBED_BASE = 'https://www.youtube.com/embed';
const API_URL = 'https://www.youtube.com/iframe_api';
const API_GLOBAL = 'YT';
const API_GLOBAL_READY = 'onYouTubeIframeAPIReady';
const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;

youtube.canPlay = src => MATCH_URL.test(src);

export function youtube(element) {
  let api;
  let iframe;
  let ready;
  let style = createResponsiveStyle(element);
  let filterEventByData;
  let YT;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      playsinline: element.playsinline,
      controls: element.controls,
      origin: location.origin,
      enablejsapi: 1,
      ...element.config.youtube,
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
    const src = `${EMBED_BASE}/${videoId}?${serialize(boolToBinary(options))}`;
    iframe = createEmbedIframe({ src });

    YT = await loadScript(API_URL, API_GLOBAL, API_GLOBAL_READY);
    api = new YT.Player(iframe, {
      events: {
        onReady: ready.resolve
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

  const methods = {

    get element() {
      return iframe;
    },

    get api() {
      return api;
    },

    ready() {
      return ready;
    },

    remove() {
      api.destroy();
    },

    play() {
      return api.playVideo();
    },

    pause() {
      return api.pauseVideo();
    },

    stop() {
      return api.stopVideo();
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
      style.update(element);
      element.load();

      // `api.cueVideoById` works but `api.getDuration()` is never updated ;(
      // api.cueVideoById(getVideoId(src));
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

  return extend(style.methods, methods);
}

export const YouTube = define('player-youtube', youtube);
