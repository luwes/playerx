// https://schema.org/VideoObject
// https://developers.google.com/search/docs/data-types/video
import { define } from 'playerx';
import { requestJson, secondsToISOString } from './utils.js';

// https://schema.org -> oEmbed
const required = {
  name: 'title',                  // required for Google
  description: 'description',     // required for Google
  uploadDate: 'upload_date',      // required for Google
  thumbnailUrl: 'thumbnail_url',  // required for Google
};

const defaultTranslation = {
  ...required,
  duration: 'duration',
  embedUrl: ['html', '<iframe[^>]+src="([^"]+)'],
};

export const props = {
  reflect: {
    oembedurl: 'https://api.playerx.io/oembed',
  },
  seo: {
    value: false,
    set: (host, val) => val,
  },
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
  data: null
};

/** @typedef { import('./index').PlxSchema } PlxSchema */

/**
 * @type {(el: PlxSchema) => void}
 */
function schema(el) {
  const linkedData = getInlineJSON(el);
  el.data = { ...linkedData };

  function onloadsrc() {
    el.data = { ...linkedData };
  }

  async function onloadedsrc() {
    let url = `${el.oembedurl}?url=${encodeURIComponent(
      el.src || el.player.src
    )}`;

    const { data } = el;
    let oEmbedData = {};

    try {
      oEmbedData = await requestJson(url);
      Object.assign(data, oEmbedToSchema(oEmbedData));
    } catch (error) {
      console.error(error);
    }

    if (data.duration != null && !(data.duration+'').includes('P')) {
      data.duration = secondsToISOString(data.duration);
    }

    if (data.uploadDate != null) {
      data.uploadDate = new Date(data.uploadDate).toISOString();
    }

    if (!el.seo) return;

    Object.keys(defaultTranslation).forEach((prop) => {
      if (data[prop] == null) {
        if (required[prop] && el.seo) {
          console.warn(`${prop} (${data['@type']}) data missing!`);
        }
        delete data[prop];
      }
    });

    renderLinkedData(el, oEmbedData);
  }

  return {
    onloadsrc,
    onloadedsrc,
  };
}

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

/**
 * @type {(CE: Class, options: Object) => (el: PlxSchema) => void}
 */
const setup = () => (el) => {
  let isInit;
  let api;
  connected();

  function connected() {
    if (!isInit && (el.player || el.src)) {
      isInit = true;
      api = schema(el);

      if (el.player) {
        el.player.addEventListener('loadsrc', api.onloadsrc);
        el.player.addEventListener('loadedsrc', api.onloadedsrc);
      }
    }
  }

  async function load() {
    // Wait one tick so the `el.src` property is set.
    await Promise.resolve();
    // Init schema if it was not yet done.
    connected();

    await api.onloadsrc();
    await api.onloadedsrc();
  }

  return {
    connected,
    load,
  };
};

export const PlxSchema = define('plx-schema', {
  props,
  setup,
});
