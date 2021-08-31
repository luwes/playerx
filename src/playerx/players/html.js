
import {
  createElement,
  removeNode,
  publicPromise,
  getFileName,
} from '../utils.js';

export function createPlayer(element) {
  let video;
  let ready;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.html,
    };
  }

  function init() {
    ready = publicPromise();
    video = createElement('video');
    load(getOptions());
    ready.resolve();
  }

  function load(opts) {
    const { src } = opts;
    delete opts.src;

    reset();
    Object.assign(video, opts);

    if (Array.isArray(src)) {
      let sources = src;
      sources.map(source => {
        const attrs = typeof source === 'string' ? { src: source } : source;
        video.appendChild(createElement('source', attrs));
      });
      video.load();
    } else {
      video.src = src;
    }
  }

  function reset() {
    video.removeAttribute('src');
    video.innerHTML = '';
  }

  const meta = {
    get identifier() { return getFileName(video.currentSrc || video.src); },
  };

  const methods = {
    name: 'html',
    version: '5',
    meta,

    get element() {
      return video;
    },

    get api() {
      return video;
    },

    ready() {
      return ready;
    },

    remove() {
      reset();
      removeNode(video);
    },

    on(eventName, callback) {
      video.addEventListener(eventName, callback);
    },

    off(eventName, callback) {
      video.removeEventListener(eventName, callback);
    },

    async setSrc() {
      ready = publicPromise();
      load(getOptions());
      ready.resolve();
    },
  };

  init();

  return methods;
}
