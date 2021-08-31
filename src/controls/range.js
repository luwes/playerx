import { define, css, utils } from 'playerx';

const styles = (selector) => css`
  ${selector} {
    color: var(--plx-range-fill-background, var(--plx-color-main, #30E6B0));
    height: max(var(--plx-range-thumb-height), var(--plx-range-track-height));

    -webkit-appearance: none;
    background: transparent; /* Otherwise white in Chrome */
    display: flex;
    width: 100%;
  }

  /* Special styling for WebKit/Blink */
  ${selector}::-webkit-slider-thumb { ${thumbStyles} }
  ${selector}::-moz-range-thumb { ${thumbStyles} }

  ${selector}::-webkit-slider-runnable-track { ${trackStyles} }
  ${selector}::-moz-range-track { ${trackStyles} }
  ${selector}::-ms-track {
    width: 100%;
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
    color: transparent;

    ${trackStyles}
  }
`;

const thumbStyles = css`
  height: var(--plx-range-thumb-height, 8px);
  width: var(--plx-range-thumb-width, 8px);
  border: var(--plx-range-thumb-border, none);
  border-radius: var(--plx-range-thumb-border-radius, 50%);
  background: var(--plx-range-thumb-background, rgba(250, 245, 238, 1));
  cursor: pointer;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

const trackStyles = css`
  height: var(--plx-range-track-height, 8px);
  border: var(--plx-range-track-border, none);
  border-radius: var(--plx-range-track-border-radius, 4px);
  background-image: linear-gradient(to right, currentColor var(--value, 0), transparent var(--value, 0));

  display: flex;
  cursor: pointer;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

const setup = () => (el) => {
  el.type = 'range';
  el.step = 0.01;
  el.min = 0;
  el.max = 100;
  el.value = 9.25;

  reflectValue(el);
};

function reflectValue(el) {
  let ignoreAttributeChange;
  let selector = '__';
  let elementRule = utils.addCssRule(selector);

  onValueChange();
  el.addEventListener('input', onValueChange);
  el.addEventListener('change', onValueChange);

  function onValueChange() {
    if (ignoreAttributeChange) return;

    ignoreAttributeChange = true;
    el.setAttribute('value', el.value);

    let selectorText = `${el.tagName}[type="range"][value="${el.value}"]::-webkit-slider-runnable-track`;
    utils.deleteCssRule(elementRule);

    const thumbWidth = getComputedStyle(el)
      .getPropertyValue('--plx-range-thumb-width') || '8px';

    const bgWidth = `calc(calc(${thumbWidth} * ${0.5 - el.value / 100}) + ${el.value}%)`;
    elementRule = utils.addCssRule(selectorText, {
      '--value': bgWidth
    });

    ignoreAttributeChange = false;
  }
}

export const PlxRange = define('plx-range', {
  extends: 'input',
  styles,
  setup,
});
