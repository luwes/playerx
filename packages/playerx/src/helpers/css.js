import { addCssRule, boxUnit } from '../utils/css.js';

export function createResponsiveStyle(props, tag = 'iframe') {
  let element;
  let before;
  update(props);

  function update({ src, width, height, aspectRatio }) {
    const selector = `player-x[src="${src}"]`;

    element = addCssRule(selector, {
      width,
      height,
      display: 'block',
      position: 'relative',
    });

    before = addCssRule(`${selector}::before`, {
      content: '""',
      'padding-top': `${aspectRatio * 100}%`,
      'margin-left': boxUnit(-1),
      width: boxUnit(1),
      height: 0,
      float: 'left',
    });

    addCssRule(`${selector}::after`, {
      content: '""',
      display: 'table',
      clear: 'both',
    });

    addCssRule(`${selector} > ${tag}`, {
      position: 'absolute',
      width: '100%',
      height: '100%',
    });
  }

  return {
    update,
    methods: {

      set width(width) {
        element.style.width = width == null ? '' : boxUnit(width);
      },

      get width() {
        return element.style.width;
      },

      set height(height) {
        element.style.height = height == null ? '' : boxUnit(height);
      },

      get height() {
        return element.style.height;
      },

      set aspectRatio(ratio) {
        before.style.setProperty('padding-top', `${ratio * 100}%`);
      },
    }
  };
}
