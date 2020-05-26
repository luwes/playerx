import { property, readonly, reflect } from 'swiss';

const readonlyProps = readonly({
  buffered: undefined,
  currentSrc: '',
  duration: NaN,
  ended: false,
  error: null,
  paused: true,
  readyState: 0,
  videoHeight: 0,
  videoWidth: 0,
  name: undefined,            // custom property
  version: undefined,         // custom property
});

const reflectProps = reflect({
  aspectRatio: 0.5625,        // custom property
  autoplay: false,
  controls: false,
  height: undefined,
  loop: false,
  muted: false,
  playing: false,
  playsinline: false,
  preload: undefined,
  src: undefined,
  width: '100%',
});

export const props = {
  ...readonlyProps,
  ...reflectProps,

  currentTime: 0,
  playbackRate: 1,
  volume: 1,

  videoId: undefined,         // custom property
  videoTitle: undefined,      // custom property

  config: {
    ...property({          // custom property
      vimeo: {
        autopause: false,
        // byline: false,
        // portrait: false,
        // title: false,
        // dnt: true,
      },
      youtube: {
        showinfo: 0,
        rel: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
      soundcloud: {
        visual: true, // Undocumented, player fills iframe and looks better.
        // buying: false,
        // liking: false,
        // download: false,
        // sharing: false,
        // show_comments: false,
        // show_playcount: false,
      },
      wistia: {
        // videoFoam: false,
        // silentAutoPlay: 'allow',
      },
      facebook: {
        appId: '197575574668798',
        version: 'v3.2',
      },
      dailymotion: {
        'queue-enable': false,
        // 'ui-logo': false,
      },
      jwplayer: {
        player: 'IxzuqJ4M', // Via https://content.jwplatform.com/libraries/{player_id}.js
        // key: '',         // or https://ssl.p.jwpcdn.com/player/v/8.12.5/jwplayer.js
      },
      brightcove: {
        account: '1752604059001',
      }
    }),
    fromAttribute: JSON.parse,
  }
};
