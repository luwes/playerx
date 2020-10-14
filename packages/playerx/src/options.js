import * as canPlay from './canplay.js';

export const options = {
  players: {
    file: {
      canPlay: canPlay.file,
      lazyPlayer: () => import('./players/file.js'),
    },
    vimeo: {
      canPlay: canPlay.vimeo,
      lazyPlayer: () => import('./players/vimeo.js'),
    },
    youtube: {
      canPlay: canPlay.youtube,
      lazyPlayer: () => import('./players/youtube.js'),
    },
    wistia: {
      canPlay: canPlay.wistia,
      lazyPlayer: () => import('./players/wistia.js'),
    },
  },
};
