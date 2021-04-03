import { define, css } from 'playerx';
import { createElement } from './utils.js';

const styles = (selector) => css`
  ${selector} {
    background: var(--plx-seek-bar-background, transparent);
    height: var(--plx-seek-bar-height, 8px);
    position: relative;
    display: block;
    width: 100%;
  }

  ${selector} input, ${selector} progress {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const props = {};

const setup = () => (el) => {
  const progress = el.appendChild(createElement('progress', { is: 'plx-progress' }));
  const range = el.appendChild(createElement('input', { is: 'plx-range' }));

  return {
    progress,
    range,
  };
};

export const PlxSeekBar = define('plx-seek-bar', {
  styles,
  props,
  setup,
});
