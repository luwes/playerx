import * as swiss from 'swiss';
import { findAncestor, getStyle } from './utils.js';

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
        ...def.props && swiss.reflect(def.props.reflect)
      },
    },
    Base
  );

  def.props && delete def.props.reflect;

  CE.mixins.push(StylesMixin);
  CE.styles = def.styles;
  return CE;
};

const StylesMixin = ({ base }, { styles, name }) => (el) => {
  const sheet = getStyle(el);
  if (styles) {
    const selector = base.extends ? `${base.extends}[is="${name}"]` : name;
    sheet.firstChild.data += styles(
      selector,
      base.styles ? base.styles(selector) : undefined
    );
  }
};

export const define = (name, def) => {
  return swiss.define(name, def, Element);
};

export const css = function (strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    str += string + (values[i] || '');
  });
  return str;
};
