// https://docs.theoplayer.com/getting-started/01-sdks/01-web/00-getting-started.md

import {
  createElement,
  loadScript,
  publicPromise,
  getFileName,
} from '../utils.js';

const API_GLOBAL = 'THEOplayer';

export function createPlayer(element) {
  let api;
  let div;
  let ready;
  let THEOplayer;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.theoplayer,
    };
  }

  async function init() {
    ready = publicPromise();
    div = createElement('div', {
      class: 'video-js theoplayer-skin',
      style: 'width:100%;height:100%',
    });

    const opts = getOptions();
    const { libraryLocation, license } = opts;
    delete opts.libraryLocation;
    delete opts.license;

    document.head.appendChild(createElement('link', {
      href: `${libraryLocation}/ui.css`,
      rel: 'stylesheet',
    }));

    const API_URL = `${libraryLocation}/THEOplayer.js`;
    THEOplayer = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);
    api = new THEOplayer.Player(div, {
      libraryLocation,
      license,
    });
    Object.assign(api, opts);

    ready.resolve();
  }

  const meta = {
    get identifier() { return getFileName(api.currentSrc || api.src); },
  };

  const methods = {
    name: 'Theo Player',
    key: 'theoplayer',
    meta,

    get version() { return THEOplayer.version || ''; },

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
      api.destroy();
    },
  };

  init();

  return methods;
}
