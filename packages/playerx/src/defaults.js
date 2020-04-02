
export const readonly = {
  buffered: undefined,
  duration: NaN,
  ended: false,
  paused: true,
  played: undefined,
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
};
