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
      player: 'IxzuqJ4M', // Via https://content.jwplatform.com/libraries/{player_id}.js
      // key: '',         // or https://ssl.p.jwpcdn.com/player/v/8.12.5/jwplayer.js
    },
    brightcove: {
      account: '1752604059001',
    },
  });
};

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
    },
  };
};

playerx.options.plugins.push(
  defaultConfig,
  lazyLoader('/js/mux.js', 'muxLazy'),
  loading
);

export default playerx;
