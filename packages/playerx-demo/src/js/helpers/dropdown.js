import { observable } from 'sinuous';
import { stopProp } from '../utils/dom.js';
import { invert } from '../utils/utils.js';

export function dropdown() {
  const isOpen = observable(false);
  const isHidden = observable(true);
  const toggle = stopProp(invert(isOpen));
  const open = stopProp(() => isOpen(true));
  const close = stopProp(() => isOpen(false));
  let transitioning = false;

  function classes() {
    const dataset = this.el.dataset;
    const type = `transition:${isOpen() ? 'enter' : 'leave'}`;

    if (!transitioning) {
      transitioning = true;

      requestAnimationFrame(() => {
        // 2. Show the element after one tick.
        if (isOpen()) isHidden(false);
        // 3. Continues below...
        requestAnimationFrame(() => isOpen(isOpen()));
      });

      // 1. First set the start CSS classes.
      return `${dataset[type]} ${dataset[`${type}Start`]}`;
    }

    // 3. Lastly set the end CSS classes and hide the element on transition end.
    this.el.addEventListener('transitionend', onTransitionEnd, { once: true });
    function onTransitionEnd() {
      if (!isOpen()) isHidden(true);
    }

    transitioning = false;
    return `${dataset[type]} ${dataset[`${type}End`]}`;
  }

  return Object.assign(classes, {
    toggle,
    open,
    close,
    isHidden,
    isOpen,
  });
}
