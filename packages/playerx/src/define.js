import { Element } from 'swiss';
import { PlayerxMixin } from './playerx-mixin.js';
import { LoadingMixin } from './loading.js';
import { props } from './defaults.js';

export function define(name, create) {
  const CE = Element({
    props,
    create
  });

  CE.mixins.push(PlayerxMixin, LoadingMixin);

  // Wait one tick to define the custom element for plugins to be added.
  Promise.resolve().then(() => {
    if (!customElements.get(name)) {
      customElements.define(name, CE);
    }
  });

  return CE;
}
