import { options } from 'playerx';

import { canPlay as canPlayBrightcove } from './players/brightcove.js';
import { canPlay as canPlayDailymotion } from './players/dailymotion.js';
import { canPlay as canPlayFacebook } from './players/facebook.js';
import { canPlay as canPlaySoundcloud } from './players/soundcloud.js';
import { canPlay as canPlayStreamable } from './players/streamable.js';
import { canPlay as canPlayTwitch } from './players/twitch.js';
import { canPlay as canPlayVidyard } from './players/vidyard.js';

// See options.js for the default enabled players.
Object.assign(options.players, {
  brightcove: {
    canPlay: canPlayBrightcove,
    lazyPlayer: () => import('./players/brightcove.js'),
  },
  dailymotion: {
    canPlay: canPlayDailymotion,
    lazyPlayer: () => import('./players/dailymotion.js'),
  },
  facebook: {
    canPlay: canPlayFacebook,
    lazyPlayer: () => import('./players/facebook.js'),
  },
  soundcloud: {
    canPlay: canPlaySoundcloud,
    lazyPlayer: () => import('./players/soundcloud.js'),
  },
  streamable: {
    canPlay: canPlayStreamable,
    lazyPlayer: () => import('./players/streamable.js'),
  },
  twitch: {
    canPlay: canPlayTwitch,
    lazyPlayer: () => import('./players/twitch.js'),
  },
  vidyard: {
    canPlay: canPlayVidyard,
    lazyPlayer: () => import('./players/vidyard.js'),
  },
});
