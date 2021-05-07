
import {
  createElement,
  removeNode,
  publicPromise,
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

  async function init() {
    ready = publicPromise();
    video = createElement('video');

    await load(getOptions());
    ready.resolve();
  }

  async function load(opts) {
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

  const methods = {
    name: 'html',
    version: '5',

    get element() {
      return video;
    },

    get api() {
      return video;
    },

    get videoId() {
      return (video.currentSrc || video.src).split('/').pop();
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

    getSrc() {
      return element.cache('src');
    },

    async setSrc() {
      ready = publicPromise();

      await load(getOptions());
      ready.resolve();
    },
  };

  init();

  return methods;
}
