import { getStyle, addCssRule, cssNumber } from '../utils/css.js';

const sheet = getStyle();
sheet.firstChild.data += `
  player-x {
    display: block;
    position: relative;
    width: 100%
  }
  player-x::before {
    content: "";
    margin-left: -1px;
    width: 1px;
    height: 0;
    float: left;
    padding-top: 56.25%
  }
  player-x::after {
    content: "";
    display: table;
    clear: both
  }
  plx-media,plx-media>* {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%
  }
`;

export function createResponsiveStyle(element) {
  const { width, height, aspectRatio } = element;
  const selector = '__';
  const elementRule = addCssRule(selector, {
    width,
    height,
  });
  const beforeRule = addCssRule(selector, {
    'padding-top': `${aspectRatio * 100}%`,
  });
  updateSelector(element);

  function updateSelector(el) {
    let selectorText = '';
    if (el.width) {
      selectorText += `player-x[width="${el.width}"]`;
    }
    if (el.height) {
      selectorText += `[height="${el.height}"]`;
    } else if (el.aspectRatio) {
      selectorText += `[aspect-ratio="${el.aspectRatio}"]`;
    }
    if (selectorText) {
      elementRule.selectorText = selectorText;
      beforeRule.selectorText = selectorText + '::before';
    }
  }

  return {
    set width(value) {
      elementRule.style.width = value == null ? '' : cssNumber(value);
      updateSelector(element);
    },

    get width() {
      return elementRule.style.width;
    },

    set height(value) {
      elementRule.style.height = value == null ? '' : cssNumber(value);
      updateSelector(element);
    },

    get height() {
      return elementRule.style.height;
    },

    set aspectRatio(value) {
      beforeRule.style.setProperty('padding-top', `${value * 100}%`);
      updateSelector(element);
    },
  };
}
