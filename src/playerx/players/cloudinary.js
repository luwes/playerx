// https://cloudinary.com/documentation/video_player_how_to_embed

import { cloudinary as MATCH_SRC } from '../constants/src-regex.js';
import {
  createElement,
  loadScript,
  publicPromise,
  promisify,
  uniqueId,
} from '../utils.js';

const API_GLOBAL = 'cloudinary';
const version = '1.5.9';

export function createPlayer(element) {
  let api;
  let div;
  let ready;
  let cloudinary;

  function getOptions() {
    return {
      autoplay: element.playing || element.autoplay,
      controls: element.controls,
      src: element.src,
      ...element.config.cloudinary,
    };
  }

  async function init() {
    ready = publicPromise();

    const opts = getOptions();
    const id = uniqueId('cld');

    document.head.appendChild(
      createElement('link', {
        href: `https://cdn.jsdelivr.net/npm/cloudinary-video-player@${version}/dist/cld-video-player.min.css`,
        rel: 'stylesheet',
      })
    );

    div = createElement('video', {
      id,
      autoplay: opts.autoplay ? '' : null,
      controls: opts.controls ? '' : null,
      style: 'width:100%;height:100%',
    });

    loadScript(
      'https://cdn.jsdelivr.net/npm/cloudinary-core@latest/cloudinary-core-shrinkwrap.min.js',
      API_GLOBAL
    );

    const API_URL = `https://cdn.jsdelivr.net/npm/cloudinary-video-player@${version}/dist/cld-video-player.min.js`;
    cloudinary = await loadScript(opts.apiUrl || API_URL, API_GLOBAL);

    const matches = opts.src.match(MATCH_SRC);
    const cloud_name = matches && matches[1];
    const streaming_profile = matches && matches[2];
    const publicId = matches && matches[3];

    var cld = cloudinary.Cloudinary.new({ cloud_name });
    api = cld.videoPlayer(id, {
      ...opts,
      publicId,
      sourceTypes: ['hls', 'mp4'],
      transformation: {
        streaming_profile,
      },
    });

    await promisify(api.on, api)('ready');
    ready.resolve();
  }

  const meta = {
    get identifier() {
      const matches = getOptions().src.match(MATCH_SRC);
      return matches && matches[2];
    },
  };

  const methods = {
    name: 'Cloudinary',
    key: 'cloudinary',
    meta,

    get version() {
      return version || '';
    },

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
      api.dispose();
    },

    setSrc() {
      // Must return promise here to await ready state.
      return element.load();
    },
  };

  init();

  return methods;
}
