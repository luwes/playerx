import { define, css } from 'playerx';

const styles = (selector) => css`
  ${selector} {
    -webkit-appearance: none;
    display: block;
    width: 100%;
    height: 8px;
  }

  ${selector}::-webkit-progress-bar {
    background: var(--plx-progress-bar-background, rgba(250, 245, 238, 0.3));
    height: var(--plx-progress-bar-height, 4px);
    border: var(--plx-progress-bar-border, none);
    border-radius: var(--plx-progress-bar-border-radius, 4px);
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  ${selector}::-webkit-progress-value {
    background: var(--plx-progress-value-background, rgba(250, 245, 238, 0.6));
    height: var(--plx-progress-value-height, 4px);
    border: var(--plx-progress-value-border, none);
    border-radius: var(--plx-progress-value-border-radius, 4px 0 0 4px);
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const setup = () => (el) => {
  el.max = 100;
  el.value = 5;
};

export const PlxProgress = define('plx-progress', {
  extends: 'progress',
  styles,
  setup,
});
