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
  api: undefined,             // custom property
  name: undefined,            // custom property
  key: undefined,             // custom property
  version: undefined,         // custom property
});

const reflectProps = reflect({
  aspectRatio: undefined,     // custom property
  autoplay: false,
  controls: false,
  height: undefined,
  loop: false,
  muted: false,
  playing: false,             // custom property
  playsinline: false,
  preload: undefined,
  src: undefined,
  width: undefined,
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
    ...property({}),          // custom property
    fromAttribute: JSON.parse,
  }
};
