import 'playerx-preview';
import * as playerx from 'playerx';
import { loading } from 'playerx-loading';

const lazyLoader = (url, globalName) => () => (player) => {
  const { load } = player;
  let initiated;

  return {
    async load() {
      if (!initiated) {
        initiated = true;

        let plugin = await playerx.loadScript(url, globalName);
        if (plugin && typeof plugin !== 'function') {
          plugin = plugin[Object.keys(plugin)[0]];
        }
        plugin(player.constructor)(player);
      }
      return load();
    }
  };
};

playerx.options.plugins.push(lazyLoader('/js/mux.js', 'muxLazy'), loading);

export default playerx;
