import { Element, addCssRule } from 'playerx';
import { getThumbnailDimensions } from './utils/image.js';

const IMAGE_EXTENSIONS = /\.(jpe?g|gif|a?png|svg|webp)($|\?)/i;

addCssRule('plx-preview,plx-preview>img', {
  width: '100%',
  height: '100%',
  position: 'absolute',
  transition: 'opacity .1s'
});

addCssRule('plx-preview.hidden', {
  display: 'none',
});

addCssRule('plx-preview.opacity-0', {
  opacity: 0,
});

addCssRule('plx-preview>button', {
  position: 'relative',
});

const props = {
  src: {
    get: (el, src) => src,
    set: (el, src) => {
      setSrc(el, src);
      return src;
    },
    reflect: true,
  },
};

async function setSrc(el, src) {
  el._loadingThumbnail = true;
  await Promise.resolve();

  let { width, height } = el.getBoundingClientRect();
  const devicePixelRatio = window.devicePixelRatio || 1;
  width *= devicePixelRatio;
  height *= devicePixelRatio;
  ({ width, height } = getThumbnailDimensions({ width, height }));

  try {
    if (!IMAGE_EXTENSIONS.test(src) && width && height) {
      src = await fetchThumbnail(src, width, height);
    }
    await addThumbnail(el, src);
  } catch (error) {
    el._loadingThumbnail = false;
    return;
  }

  el._loadedWidth = width;
  el._loadingThumbnail = false;
}

async function fetchThumbnail(src, width, height) {
  const url = `https://noembed.com/embed?url=${src}&maxwidth=${width}&maxheight=${height}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.thumbnail_url) {
    src = data.thumbnail_url;
  }
  return src;
}

function addThumbnail(el, src) {
  let previewImage = el.querySelector('img');
  if (!previewImage) {
    previewImage = new Image();
    el.insertBefore(previewImage, el.firstChild);
  }
  previewImage.src = src;

  return new Promise((resolve, reject) => {
    previewImage.addEventListener('load', resolve);
    previewImage.addEventListener('error', reject);
  });
}

const setup = () => (el) => {

  function connected() {
    el.addEventListener('click', onClick);
    el.addEventListener('transitionend', onTransitionEnd);

    const player = findAncestor(el, 'player-x');
    player.addEventListener('play', onPlay);
  }

  function onClick() {
    const player = findAncestor(el, 'player-x');
    player.play();
    onPlay();
  }

  function onTransitionEnd() {
    el.classList.add('hidden');
  }

  function onPlay() {
    el.classList.add('opacity-0');
  }

  return { connected };
};

function findAncestor(el, sel) {
  while ((el = el.parentElement) && !el.matches(sel));
  return el;
}

const PlxPreview = Element({
  props,
  setup,
});

customElements.define('plx-preview', PlxPreview);

export {
  PlxPreview
};
