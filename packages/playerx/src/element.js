import { Element as SwissElement, reflect } from 'swiss';
import { findAncestor } from './utils.js';

const props = {
  player: {
    get: (el) => {
      if (el.hasAttribute('player')) {
        return document.querySelector(`#${el.hasAttribute('player')}`);
      }
      return findAncestor(el, 'player-x');
    },
  },
};

export const Element = (options) => {
  return SwissElement({
    ...options,
    props: {
      ...props,
      ...options.props
    }
  });
};

Element.reflect = reflect;
