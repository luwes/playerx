import { Element, property, addCssRule } from 'playerx';
import { createElement, findAncestor } from './utils/dom.js';
import { getThumbnailDimensions } from './utils/image.js';
import { requestJson } from './utils/request.js';

const IMAGE_EXTENSIONS = /\.(jpe?g|gif|a?png|svg|webp)($|\?)/i;

addCssRule('plx-preview', {
  display: 'block',
});

addCssRule('plx-preview img', {
  position: 'relative',
  width: '100%',
  height: 'auto',
});

addCssRule('player-x:not([loading]) plx-preview', {
  opacity: 0,
  'pointer-events': 'none',
});

export const PlxPreviewProps = {
  player: {
    get: (el) => {
      if (el.hasAttribute('player')) {
        return document.querySelector(`#${el.hasAttribute('player')}`);
      }
      return findAncestor(el, 'player-x');
    },
  },
  oembedurl: property('https://api.playerx.io/oembed'),
  title: property(),
  loading: property(),
  src: {
    get: (el, src) => src,
    set: (el, src, oldSrc) => {
      setSrc(el, src, oldSrc);
      return src;
    },
    reflect: true,
  },
};

async function setSrc(el, src, oldSrc) {
  if (src !== oldSrc) {
    el.load();
  }
}

export const PlxPreviewMixin = () => (el) => {

  async function load() {
    await Promise.resolve();

    let { width, height } = el.getBoundingClientRect();
    if (!width) width = el.parentNode && el.parentNode.clientWidth;

    const devicePixelRatio = window.devicePixelRatio || 1;
    width *= devicePixelRatio;
    height *= devicePixelRatio;
    ({ width, height } = getThumbnailDimensions({ width, height }));

    let data = {
      thumbnail_url: el.src,
      title: el.title,
    };

    try {
      if (!IMAGE_EXTENSIONS.test(el.src)) {

        let url = `${el.oembedurl}?url=${el.src}`;
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

    const sources = (thumbnails || []).map(t => {
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
};

export const PlxPreview = Element({
  props: PlxPreviewProps,
  setup: PlxPreviewMixin,
});

customElements.define('plx-preview', PlxPreview);
