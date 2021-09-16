import { define, mixins } from 'swiss/element.js';
import { StylesMixin, css } from 'swiss/styles.js';
import {
  getThumbnailDimensions,
  requestJson,
  findAncestor,
  createElement,
} from './utils.js';

mixins.push(StylesMixin);

const IMAGE_EXTENSIONS = /\.(jpe?g|gif|a?png|svg|webp|avif)($|\?)/i;

const styles = (selector) => css`
  player-x ${selector} {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  ${selector} {
    display: block;
  }

  ${selector} img {
    position: relative;
    width: 100%;
    height: auto;
  }

  ${selector}[hidden] {
    pointer-events: none;
  }
`;

export const props = (el) => ({
  get player() {
    if (el.hasAttribute('player')) {
      return document.querySelector(`#${el.hasAttribute('player')}`);
    }
    return findAncestor(el, 'player-x');
  },
  get oembedurl() {
    return el.getAttribute('oembedurl') || 'https://api.playerx.io/oembed';
  },
  set oembedurl(url) {
    el.setAttribute('oembedurl', url);
  },
  get loading() {
    return el.getAttribute('loading');
  },
  set loading(loading) {
    el.setAttribute('loading', loading);
  },
  get title() {
    return el.getAttribute('title');
  },
  set title(title) {
    el.setAttribute('title', title);
  },
  get src() {
    return el.getAttribute('src');
  },
  set src(src) {
    el.setAttribute('src', src);
  },
});

function preview(el) {
  async function load() {
    let { width, height } = el.getBoundingClientRect();
    if (!width) width = el.parentNode && el.parentNode.clientWidth;

    const src = el.src || el.player.src;
    const devicePixelRatio = window.devicePixelRatio || 1;
    width *= devicePixelRatio;
    height *= devicePixelRatio;
    ({ width, height } = getThumbnailDimensions({ width, height }));

    let data = {
      thumbnail_url: src,
      title: el.title,
    };

    try {
      if (el.oembedurl.length && !IMAGE_EXTENSIONS.test(src)) {
        let url = `${el.oembedurl}?url=${encodeURIComponent(src)}`;
        if (width) url += `&maxwidth=${width}`;
        if (height) url += `&maxheight=${height}`;

        Object.assign(data, await requestJson(url));
      }

      await addThumbnail(data);
    } catch (error) {
      //...
    }
  }

  function addThumbnail({ thumbnail_url, thumbnails, title }) {
    let pic = el.querySelector('picture,img');
    if (pic) return;

    const sources = (thumbnails || []).map((t) => {
      return createElement('source', {
        srcset: t.url,
        type: t.type,
      });
    });

    let img = createElement('img', {
      loading: el.loading,
      src: thumbnail_url,
      alt: title,
      'aria-label': title,
    });
    sources.push(img);

    pic = createElement('picture', {}, ...sources);
    el.insertBefore(pic, el.firstChild);

    return new Promise((resolve, reject) => {
      img.addEventListener('load', resolve);
      img.addEventListener('error', reject);
    });
  }

  function unload() {
    let pic = el.querySelector('picture,img');
    if (pic) {
      el.removeChild(pic);
    }
  }

  return {
    load,
    unload,
  };
}

const setup = () => (el) => {
  let isInit;
  let api;
  let loadPromise;

  async function connected() {
    if (shouldInit()) {
      isInit = true;
      api = preview(el);
      await api.load();
    }
  }

  function shouldInit() {
    return !isInit && ((el.player && el.player.src) || el.src);
  }

  function attributeChanged(name) {
    if (name === 'src') {
      load();
    }
  }

  async function load() {
    if (loadPromise) {
      return loadPromise;
    }

    // Init preview if it was not yet done.
    if (shouldInit()) {
      await (loadPromise = connected());
      return;
    }
    await (loadPromise = api.load());

    loadPromise = null;
  }

  function unload() {
    api.unload();
  }

  return {
    connected,
    attributeChanged,
    load,
    unload,
  };
};

export const PlxPreview = define('plx-preview', {
  styles,
  props,
  setup,
});
