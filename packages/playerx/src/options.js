import * as canPlay from './canplay.js';
import * as preconnect from './preconnect.js';

export const options = {
  players: {
    file: {
      canPlay: canPlay.file,
      lazyPlayer: () => import('./players/file.js'),
    },
    vimeo: {
      canPlay: canPlay.vimeo,
      preconnect: preconnect.vimeo,
      lazyPlayer: () => import('./players/vimeo.js'),
    },
    youtube: {
      canPlay: canPlay.youtube,
      preconnect: preconnect.youtube,
      lazyPlayer: () => import('./players/youtube.js'),
    },
    wistia: {
      canPlay: canPlay.wistia,
      preconnect: preconnect.wistia,
      lazyPlayer: () => import('./players/wistia.js'),
    },
  },
};
