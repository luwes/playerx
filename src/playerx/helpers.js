import {
  createElement,
  startCase,
  camelCase,
  promisify,
  addCssRule,
  deleteCssRule,
  cssNumber,
} from './utils.js';

export const allow =
  'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';

export function createEmbedIframe({ src, ...props }) {
  return createElement('iframe', {
    src,
    width: '100%',
    height: '100%',
    allow,
    allowfullscreen: '',
    frameborder: 0,
    ...props,
  });
}

export function prefixName(prefix, name) {
  return `${prefix}${startCase(camelCase(name))}`;
}

export function getName(name) {
  return prefixName('get', name);
}

export function setName(name) {
  return prefixName('set', name);
}

export function getMetaId(matchUrl, src) {
  let match;
  return (match = src.match(matchUrl)) && match[1];
}

export function createPlayPromise(player) {
  return promisify((event, cb) => {
    let fn;
    player.on(
      event,
      (fn = () => {
        player.off(event, fn);
        cb();
      })
    );
  })('playing');
}

export function createResponsiveStyle(element) {
  let selector = '__';
  let elementRule = addCssRule(selector);
  let beforeRule = addCssRule(selector);

  function updateRules() {
    const { width, height, aspectRatio } = element;

    let selectorText = '';
    if (width) {
      selectorText += `${element.tagName}[width="${width}"]`;
    }
    if (height) {
      selectorText += `[height="${height}"]`;
    } else if (aspectRatio) {
      selectorText += `[aspect-ratio="${aspectRatio}"]`;
    }

    if (selectorText) {
      if (elementRule.selectorText !== selectorText) {
        deleteCssRule(elementRule);
        elementRule = addCssRule(selectorText, {
          width,
          height,
        });
      }
      if (beforeRule.selectorText !== selectorText + '::before') {
        deleteCssRule(beforeRule);
        beforeRule = addCssRule(selectorText + '::before', {
          'padding-top': `${aspectRatio * 100}%`,
        });
      }
    } else {
      deleteCssRule(elementRule);
      deleteCssRule(beforeRule);
    }
  }

  return {
    set width(value) {
      elementRule.style.width = value == null ? '' : cssNumber(value);
      updateRules();
    },

    get width() {
      return `${elementRule.style.width}`.replace('px', '');
    },

    set height(value) {
      elementRule.style.height = value == null ? '' : cssNumber(value);
      updateRules();
    },

    get height() {
      return `${elementRule.style.height}`.replace('px', '');
    },

    set aspectRatio(value) {
      beforeRule.style.setProperty('padding-top', `${value * 100}%`);
      updateRules();
    },
  };
}

/*
  - MEDIA_ERR_ABORTED (numeric value 1)
  The fetching process for the media resource was aborted by the user agent at the user's request.

  - MEDIA_ERR_NETWORK (numeric value 2)
  A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.

  - MEDIA_ERR_DECODE (numeric value 3)
  An error of some description occurred while decoding the media resource, after the resource was established to be usable.

  - MEDIA_ERR_SRC_NOT_SUPPORTED (numeric value 4)
  The media resource indicated by the src attribute or assigned media provider object was not suitable.
*/

/** Class representing a PlayerError. */
export class PlayerError extends Error {
  /**
   * Create a player error.
   *
   * @param  {number} code
   * @param  {string} message
   * @param  {string} fileName
   * @param  {number} lineNumber
   */
  constructor(code, message, fileName, lineNumber) {
    super(message, fileName, lineNumber);
    this.name = 'PlayerError';
    this.code = code;
    this.message = message;
  }
}
