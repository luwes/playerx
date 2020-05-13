import { Element } from 'swiss';
import { playerx } from './playerx.js';
import { options } from './options.js';
import { props } from './defaults.js';

export function define(name, create) {
  const CE = Element({
    props,
    create
  });

  Promise.resolve().then(() => {
    CE.mixins.push(playerx, ...options.plugins);
    customElements.define(name, CE);
  });

  return CE;
}
