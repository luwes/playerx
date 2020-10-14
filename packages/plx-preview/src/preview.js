import { Element, utils } from 'playerx';
import { createElement } from './utils/dom.js';
import { getThumbnailDimensions } from './utils/image.js';
import { requestJson } from './utils/request.js';

const IMAGE_EXTENSIONS = /\.(jpe?g|gif|a?png|svg|webp)($|\?)/i;

utils.addCssRule('plx-preview', {
  display: 'block',
});

utils.addCssRule('plx-preview img', {
  position: 'relative',
  width: '100%',
  height: 'auto',
});

utils.addCssRule('player-x:not([loading]) plx-preview', {
  opacity: 0,
  'pointer-events': 'none',
});

export const props = {
  ...Element.reflect({
    oembedurl: 'https://api.playerx.io/oembed',
    loading: undefined,
    title: undefined,
  }),
  src: {
    get: (el, src) => src,
    set: (el, src, oldSrc) => {
      if (src !== oldSrc) {
        el.load();
      }
      return src;
    },
    reflect: true,
  },
};

export const setup = () => (el) => {

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
  props,
  setup,
});

if (!customElements.get('plx-preview')) {
  customElements.define('plx-preview', PlxPreview);
}
