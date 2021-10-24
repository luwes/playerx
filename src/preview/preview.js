import {
  getThumbnailDimensions,
  requestJson,
  findAncestor,
  createElement,
  defineCustomElement,
  getStyle,
  css,
} from './utils.js';

const IMAGE_EXTENSIONS = /\.(jpe?g|gif|a?png|svg|webp|avif)($|\?)/i;

export const styles = css`
  player-x plx-preview {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  plx-preview img {
    position: relative;
    width: 100%;
    height: auto;
  }

  plx-preview[hidden] {
    pointer-events: none;
  }
`;

export class PlxPreview extends HTMLElement {
  static get observedAttributes() {
    return ['loading', 'title', 'src', 'oembedurl'];
  }

  constructor() {
    super();

    getStyle(this).firstChild.data += styles;
  }

  get player() {
    if (this.hasAttribute('player')) {
      return document.querySelector(`#${this.getAttribute('player')}`);
    }
    return findAncestor(this, 'player-x');
  }

  get oembedurl() {
    return this.getAttribute('oembedurl') || 'https://api.playerx.io/oembed';
  }

  set oembedurl(url) {
    this.setAttribute('oembedurl', url);
  }

  get loading() {
    return this.getAttribute('loading');
  }

  set loading(loading) {
    this.setAttribute('loading', loading);
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(title) {
    this.setAttribute('title', title);
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(src) {
    this.setAttribute('src', src);
  }

  async load() {
    let { width, height } = this.getBoundingClientRect();
    if (!width) width = this.parentNode && this.parentNode.clientWidth;

    const src = this.src || this.player.src;
    const devicePixelRatio = window.devicePixelRatio || 1;
    width *= devicePixelRatio;
    height *= devicePixelRatio;
    ({ width, height } = getThumbnailDimensions({ width, height }));

    let data = {
      thumbnail_url: src,
      title: this.title,
      loading: this.loading,
    };

    try {
      if (this.oembedurl.length && !IMAGE_EXTENSIONS.test(src)) {
        let url = `${this.oembedurl}?url=${encodeURIComponent(src)}`;
        if (width) url += `&maxwidth=${width}`;
        if (height) url += `&maxheight=${height}`;

        Object.assign(data, await requestJson(url));
      }

      await addThumbnail(this, data);
    } catch (error) {
      console.error(error);
    }
  }

  unload() {
    let pic = this.querySelector('picture,img');
    if (pic) {
      this.removeChild(pic);
    }
  }

  connectedCallback() {
    this.load();
  }

  attributeChangedCallback(name) {
    if (name === 'src') {
      this.load();
    }
  }
}

defineCustomElement('plx-preview', PlxPreview);

function addThumbnail(el, { thumbnail_url, thumbnails, title, loading }) {
  let pic = el.querySelector('picture,img');
  if (pic) return;

  const sources = (thumbnails || []).map((t) => {
    return createElement('source', {
      srcset: t.url,
      type: t.type,
    });
  });

  let img = createElement('img', {
    loading: loading,
    src: thumbnail_url,
    alt: title,
    'aria-label': title,
  });
  sources.push(img);

  pic = createElement('picture', {}, ...sources);
  el.appendChild(pic);

  return new Promise((resolve, reject) => {
    img.addEventListener('load', resolve);
    img.addEventListener('error', reject);
  });
}
