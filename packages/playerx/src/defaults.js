
export const readonly = {
  buffered: undefined,
  duration: NaN,
  ended: false,
  paused: true,
  videoHeight: 0,
  videoWidth: 0,
};

export const reflect = {
  aspectRatio: 0.5625,
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
};

export const defaultProps = {
  ...readonly,
  ...reflect,
  currentTime: 0,
  playbackRate: 1,
  volume: 1,
  config: {
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
    }
  }
};
