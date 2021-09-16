export function defineCustomElement(name, element) {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, element);
    window[element.name] = element;
  }
}

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @param {string} prefix The value to prefix the ID with.
 * @return {string} Returns the unique ID.
 * @example
 *
 *    uniqueId('contact_');
 *    // => 'contact_104'
 *
 *    uniqueId();
 *    // => '105'
 */
let idCounter = 0;
export function uniqueId(prefix) {
  let id = ++idCounter;
  return `${prefix}${id}`;
}

export function hostname(url) {
  try {
    return new URL(url).hostname;
  } catch (error) {
    return '';
  }
}

export function camelCase(name) {
  return name.replace(/[-_]([a-z])/g, ($0, $1) => $1.toUpperCase());
}

export function snakeCase(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export function camelToSnakeKeys(obj) {
  let newObj = {};
  for (let key in obj) {
    newObj[snakeCase(key)] = obj[key];
  }
  return newObj;
}

export function findAncestor(el, sel) {
  while ((el = el.parentElement) && !el.matches(sel));
  return el;
}

/**
 * A utility to create Promises with convenient public resolve and reject methods.
 * @return {Promise}
 */
export function publicPromise() {
  let resolvePromise;
  let rejectPromise;

  let promise = new Promise(function(resolve, reject) {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  promise.resolve = (...args) => (resolvePromise(...args), promise);
  promise.reject = (...args) => (rejectPromise(...args), promise);

  return promise;
}

/**
 * Mimetypes
 * @typedef MimeTypes
 * @enum
 */
export const MimeTypes = {
  mpd: 'application/dash+xml',
  m3u8: 'application/x-mpegURL',
  opus: 'video/ogg',
  ogv: 'video/ogg',
  mp4: 'video/mp4',
  mov: 'video/mp4',
  m4v: 'video/mp4',
  mkv: 'video/x-matroska',
  m4a: 'audio/mp4',
  mp3: 'audio/mpeg',
  aac: 'audio/aac',
  oga: 'audio/ogg',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  png: 'image/png',
  svg: 'image/svg+xml',
  webp: 'image/webp',
};

export function getMimeType(src) {
  const mimeType = MimeTypes[getExtension(src)] || '';
  return mimeType;
}

/**
 * @param {string} url
 * @return {string}
 */
export function getExtension(url) {
  try {
    url = new URL(url);
  } catch (error) {
    // console.error(error);
    return '';
  }

  const uriFilename = url.pathname.split('/').pop();
  const filenamePieces = uriFilename.split('.');

  // Only one piece means there is no extension.
  if (filenamePieces.length == 1) {
    return '';
  }

  return filenamePieces.pop().toLowerCase();
}
