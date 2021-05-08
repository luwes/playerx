import { options } from 'playerx';
import * as canPlay from './canplay.js';

export * from 'playerx';

// See options.js for the default enabled players.
Object.assign(options.players, {
  apivideo: {
    canPlay: canPlay.apivideo,
    lazyPlayer: () => import('./players/apivideo.js'),
  },
  brightcove: {
    canPlay: canPlay.brightcove,
    lazyPlayer: () => import('./players/brightcove.js'),
  },
  dailymotion: {
    canPlay: canPlay.dailymotion,
    lazyPlayer: () => import('./players/dailymotion.js'),
  },
  facebook: {
    canPlay: canPlay.facebook,
    lazyPlayer: () => import('./players/facebook.js'),
  },
  jwplayer: {
    canPlay: canPlay.jwplayer,
    lazyPlayer: () => import('./players/jwplayer.js'),
  },
  shakaplayer: {
    canPlay: canPlay.shakaplayer,
    lazyPlayer: () => import('./players/shakaplayer.js'),
  },
  soundcloud: {
    canPlay: canPlay.soundcloud,
    lazyPlayer: () => import('./players/soundcloud.js'),
  },
  streamable: {
    canPlay: canPlay.streamable,
    lazyPlayer: () => import('./players/streamable.js'),
  },
  twitch: {
    canPlay: canPlay.twitch,
    lazyPlayer: () => import('./players/twitch.js'),
  },
  videojs: {
    canPlay: canPlay.videojs,
    lazyPlayer: () => import('./players/videojs.js'),
  },
  vidyard: {
    canPlay: canPlay.vidyard,
    lazyPlayer: () => import('./players/vidyard.js'),
  },
});
