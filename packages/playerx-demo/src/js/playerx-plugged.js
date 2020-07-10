import 'playerx-preview';
import * as playerx from 'playerx';
import { loading } from 'playerx-loading';

const defaultConfig = () => (player) => {
  Object.assign(player.config, {
    facebook: {
      appId: '197575574668798',
      version: 'v3.2',
    },
    jwplayer: {
      player: 'IxzuqJ4M',
    },
    brightcove: {
      account: '1752604059001',
    },
  });
};

const lazyLoader = (url, globalName, options) => () => (player) => {
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
        plugin(options)(player.constructor)(player);
      }
      return load();
    },
  };
};

playerx.options.plugins.push(
  defaultConfig,
  lazyLoader('/js/mux.js', 'muxLazy', {
    env_key: 'ilc02s65tkrc2mk69b7q2qdkf',
  }),
  loading
);

export default playerx;
