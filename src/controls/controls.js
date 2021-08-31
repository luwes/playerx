import { define, css } from 'playerx';

const styles = (selector) => css`
  ${selector} {
    background-color: var(--plx-control-bar-color, rgba(0, 0, 0, 0));
    opacity: 1;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    padding: 12px;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    flex-wrap: wrap;
    user-select: none;
  }
`;

const props = {};

const setup = () => () => {
  return {};
};

export const PlxPreview = define('plx-controls', {
  styles,
  props,
  setup,
});
