import { getStyle, addCssRule, deleteCssRule, cssNumber } from '../utils/css.js';

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
  let selector = '__';
  let elementRule = addCssRule(selector);
  let beforeRule = addCssRule(selector);

  function updateRules() {
    const { width, height, aspectRatio } = element;

    let selectorText = '';
    if (width) {
      selectorText += `player-x[width="${width}"]`;
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
      if (beforeRule.selectorText !== (selectorText + '::before')) {
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
