import { define } from './element.js';
import { loadScript } from './utils.js';

const props = {
  reflect: {
    loading: undefined,
    src: undefined,
  }
};

const setup = () => (el) => {
  const player = el.player;

  customElements.whenDefined(player.localName).then(() => {
    if (el.loading === 'player') {
      const { load } = player;
      Object.assign(player, {
        async load() {
          await loadScript(el.src);
          return load();
        },
      });
    } else {
      loadScript();
    }
  });
};

export const PlxScript = define('plx-script', {
  props,
  setup,
});
