import { Element, property, addCssRule } from 'playerx';
import { createElement, findAncestor } from './utils/dom.js';
import { getThumbnailDimensions } from './utils/image.js';
import { requestJson } from './utils/request.js';

const IMAGE_EXTENSIONS = /\.(jpe?g|gif|a?png|svg|webp)($|\?)/i;

addCssRule('plx-preview', {
  display: 'block',
  transition: 'opacity .1s',
});

addCssRule('plx-preview img', {
  position: 'relative',
  width: '100%',
  height: 'auto',
});

addCssRule('plx-preview.hidden', {
  display: 'none',
});

addCssRule('plx-preview.opacity-0', {
  opacity: 0,
});

addCssRule('plx-preview button', {
  position: 'relative',
});

const props = {
  oembedUrl: property('https://api.playerx.io/oembed'),
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

const setup = () => (el) => {

  function connected() {
    el.addEventListener('click', onClick);
    el.addEventListener('transitionend', onTransitionEnd);

    const player = getPlayer();
    if (player) {
      player.addEventListener('play', onPlay);
    }
  }

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

        let url = `${el.oembedUrl}?url=${el.src}`;
        if (width) url += `&maxwidth=${width}`;
        if (height) url += `&maxheight=${height}`;

        Object.assign(data, await requestJson(url));
      }

      await addThumbnail(data);

      // Wait until the thumbnail is loaded to preconnect,
      // this could be delayed with `loading=lazy`.
      if (data.head) {
        data.head.forEach(attrs => {
          if (attrs.type === 'link') {
            delete attrs.type;
            attrs.crossorigin = '';
            document.head.appendChild(createElement('link', attrs));
          }
        });
      }

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

  async function onClick() {
    const player = getPlayer();
    if (player) {
      await player.load();

      player.play();
      onPlay();
    }
  }

  function onTransitionEnd() {
    el.classList.add('hidden');
  }

  function onPlay() {
    el.classList.add('opacity-0');
  }

  /** @typedef { import('playerx').Playerx } Playerx */

  /**
   * @type {() => Playerx}
   */
  function getPlayer() {
    return findAncestor(el, 'player-x');
  }

  return {
    connected,
    load,
    unload,
  };
};

const PlxPreview = Element({
  props,
  setup,
});

customElements.define('plx-preview', PlxPreview);

export {
  PlxPreview
};
