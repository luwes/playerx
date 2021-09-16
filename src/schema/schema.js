// https://schema.org/VideoObject
// https://developers.google.com/search/docs/data-types/video
import {
  requestJson,
  secondsToISOString,
  defineCustomElement,
  findAncestor,
} from './utils.js';

// https://schema.org -> oEmbed
const required = {
  name: 'title', // required for Google
  description: 'description', // required for Google
  uploadDate: 'upload_date', // required for Google
  thumbnailUrl: 'thumbnail_url', // required for Google
};

const defaultTranslation = {
  ...required,
  duration: 'duration',
  embedUrl: ['html', '<iframe[^>]+src="([^"]+)'],
};

export class PlxSchema extends HTMLElement {
  static get observedAttributes() {
    return ['seo', 'src', 'oembedurl'];
  }

  constructor() {
    super();

    this._linkedData = getInlineJSON(this);
    this.data = { ...this._linkedData };
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

  get seo() {
    return this.getAttribute('seo') != null;
  }

  set seo(value) {
    this.setAttribute('seo', value);
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    this.setAttribute('src', value);
  }

  connectedCallback() {
    this.load();
  }

  attributeChangedCallback(name) {
    if (name === 'src') {
      this.load();
    }
  }

  async load() {
    this.data = { ...this._linkedData };

    const src = this.src || this.player.src;
    if (!src) return;

    let url = `${this.oembedurl}?url=${encodeURIComponent(src)}`;

    const { data } = this;
    let oEmbedData = {};

    try {
      oEmbedData = await requestJson(url);
      Object.assign(data, oEmbedToSchema(oEmbedData));
    } catch (error) {
      console.error(error);
    }

    if (data.duration != null && !(data.duration + '').includes('P')) {
      data.duration = secondsToISOString(data.duration);
    }

    if (data.uploadDate != null) {
      data.uploadDate = new Date(data.uploadDate).toISOString();
    }

    if (!this.seo) return;

    Object.keys(defaultTranslation).forEach((prop) => {
      if (data[prop] == null) {
        if (required[prop] && this.seo) {
          console.warn(`${prop} (${data['@type']}) data missing!`);
        }
        delete data[prop];
      }
    });

    renderLinkedData(this, oEmbedData);
  }
}

defineCustomElement('plx-schema', PlxSchema);

function getInlineJSON(host) {
  const script = host.querySelector(`script[type$="json"]`);
  return (script && JSON.parse(script.textContent)) || {};
}

function oEmbedToSchema(oEmbedData) {
  let data = {};
  for (const prop in defaultTranslation) {
    const translation = defaultTranslation[prop];
    if (Array.isArray(translation)) {
      const [key, pattern, flags] = translation;
      const regex = new RegExp(pattern, flags);
      data[prop] = regex.exec(oEmbedData[key])?.[1];
    } else if (oEmbedData[translation]) {
      data[prop] = oEmbedData[translation];
    }
  }
  return data;
}

function renderLinkedData(el, oEmbedData) {
  if (!el.seo) return;

  el.data['@context'] = 'https://schema.org';
  if (oEmbedData.type) {
    if (oEmbedData.type === 'video') {
      el.data['@type'] = 'VideoObject';
    }
    if (oEmbedData.type === 'audio') {
      el.data['@type'] = 'AudioObject';
    }
  }

  let ld = el.querySelector('script[type$="json"]');
  if (!ld) {
    ld = document.createElement('script');
    el.appendChild(ld);
  }

  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify(el.data);
}
