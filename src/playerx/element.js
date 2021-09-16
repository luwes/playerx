import * as swiss from 'swiss';
import { StylesMixin, css } from 'swiss/styles';
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

export const Element = (def, Base) => {
  const CE = swiss.Element(
    {
      ...def,
      props: {
        ...props,
        ...def.props,
        // handle shorthand for reflected properties
        ...(def.props && swiss.reflect(def.props.reflect)),
      },
    },
    Base
  );

  def.props && delete def.props.reflect;

  CE.mixins.push(StylesMixin);
  return CE;
};

export const define = (name, def) => {
  return swiss.define(name, def, Element);
};

export { css };
