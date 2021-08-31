import { define, css } from 'playerx';

const styles = (selector) => css`
  ${selector} {
    background-color: var(--plx-play-button-color, rgba(250, 245, 238, 1));
    opacity: 1;
    box-sizing: border-box;
    display: block;
    position: relative;
    width: 40px;
    height: 36px;
    border-radius: 5px;
    margin: 12px 0;
  }
`;

const props = {};

const setup = () => () => {
  return {};
};

export const PlxPlayButton = define('plx-play-button', {
  extends: 'button',
  styles,
  props,
  setup,
});
