import { define } from './element.js';
import { loadScript } from './utils.js';

const props = {
  reflect: {
    loading: undefined,
    src: undefined,
  },
};

const setup = () => (el) => {
  let didConnect;
  connected();

  function connected() {
    const { player } = el;
    if (!player || didConnect) return;

    didConnect = true;

    if (customElements.get(player.localName)) {
      onDefined();
    } else {
      customElements.whenDefined(player.localName).then(onDefined);
    }

    function onDefined() {
      const { load } = player;

      // el.loading == player
      Object.assign(player, {
        async load() {
          await loadScript(el.src);
          return load();
        },
      });
    }
  }

  return {
    connected,
  };
};

export const PlxScript = define('plx-script', {
  props,
  setup,
});
