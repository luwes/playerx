import { canPlay as canPlayFile } from './players/file.js';
import { canPlay as canPlayVimeo } from './players/vimeo.js';
import { canPlay as canPlayYoutube } from './players/youtube.js';
import { canPlay as canPlayJwplayer } from './players/jwplayer.js';
import { canPlay as canPlayWistia } from './players/wistia.js';

export const options = {
  players: {
    file: {
      canPlay: canPlayFile,
      lazyPlayer: () => import('./players/file.js'),
    },
    vimeo: {
      canPlay: canPlayVimeo,
      lazyPlayer: () => import('./players/vimeo.js'),
    },
    youtube: {
      canPlay: canPlayYoutube,
      lazyPlayer: () => import('./players/youtube.js'),
    },
    jwplayer: {
      canPlay: canPlayJwplayer,
      lazyPlayer: () => import('./players/jwplayer.js'),
    },
    wistia: {
      canPlay: canPlayWistia,
      lazyPlayer: () => import('./players/wistia.js'),
    },
  },
};
