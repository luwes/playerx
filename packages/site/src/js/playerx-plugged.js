import '@playerx/preview';
import * as playerx from '@playerx/player';

const { Playerx } = playerx;

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

const lazyLoader = (url, globalName, options) => (CE) => (player) => {
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
        plugin(options)(CE)(player);
      }
      return load();
    },
  };
};

Playerx.mixins.push(
  defaultConfig,
  lazyLoader('/js/mux.js', 'muxLazy', {
    env_key: 'ilc02s65tkrc2mk69b7q2qdkf',
  })
);

export default playerx;
