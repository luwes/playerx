import { define } from '../define.js';
import { createEmbedIframe } from '../helpers/dom.js';
import { createResponsiveStyle } from '../helpers/css.js';
import { extend } from '../utils/object.js';
import { loadScript } from '../utils/load-script.js';
import { publicPromise } from '../utils/promise.js';
import { serialize, boolToBinary } from '../utils/url.js';
import { createTimeRanges } from '../utils/time-ranges.js';

const EMBED_BASE = 'https://www.youtube.com/embed';
const API_URL = 'https://www.youtube.com/iframe_api';
const API_GLOBAL = 'YT';
const API_GLOBAL_READY = 'onYouTubeIframeAPIReady';
const MATCH_URL = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/;

youtube.canPlay = src => MATCH_URL.test(src);

export function youtube(element, reload) {
  let api;
  let iframe;
  let ready = publicPromise();
  let style = createResponsiveStyle(element);
  let filterEventByData;
  let YT;
  let progress;
  let progressInterval;
  let buffered = createTimeRanges([]);

  function getOptions() {
    return {
      ...element.config.youtube,
      autoplay: element.playing || element.autoplay,
      mute: element.muted,
      loop: element.loop,
      playsinline: element.playsinline,
      controls: element.controls,
      origin: location.origin,
      enablejsapi: 1,
    };
  }

  function getVideoId(src) {
    let match;
    return (match = src.match(MATCH_URL)) && match[1];
  }

  async function init() {
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

    element.fire('durationchange');

    // https://html.spec.whatwg.org/multipage/media.html#mediaevents
    // While the load is not suspended (see below), every 350ms (±200ms) or for
    // every byte received, whichever is least frequent, queue a task to fire
    // an event named progress at the element.
    progress = 0;
    clearInterval(progressInterval);
    progressInterval = setInterval(dispatchProgress, 350);
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
      clearInterval(progressInterval);
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
          handleEvent(eventName, data, callback);
        }
      };
      callback._listener = listener;
      api.addEventListener(eventAliases[eventName] || eventName, listener);
    },

    off(eventName, callback) {
      api.removeEventListener(
        eventAliases[eventName] || eventName,
        callback._listener
      );
    },

    set src(src) {
      style.update(element);
      reload();

      // `api.cueVideoById` works but `api.getDuration()` is never updated ;(
      // api.cueVideoById(getVideoId(src));
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

    set controls(value) {
      reload();
    },

    set currentTime(seconds) {
      api.seekTo(seconds);
      if (!element.playing) {
        element.pause();
      }
    },

    get buffered() {
      return buffered;
    },

  };

  function dispatchProgress() {
    const loaded = api.getVideoLoadedFraction();
    if (progress !== loaded) {
      if (!buffered[0]) buffered[0] = [0];
      buffered[0][1] = loaded * api.getDuration();

      progress = loaded;
      element.fire('progress');
    }
    if (progress === 1) clearInterval(progressInterval);
  }

  function handleEvent(eventName, data, callback) {
    const { ENDED } = YT.PlayerState;
    if (data === ENDED) {
      if (element.loop && !api.getPlaylist()) {
        element.play();
        return;
      }
    }
    callback();
  }

  init();

  return extend(style.methods, methods);
}

export const YouTube = define('player-youtube', youtube);
