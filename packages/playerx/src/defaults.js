import { kebabCase } from './utils/index.js';

export const defaultProps = {
  aspectRatio: 0.5625,
  autoplay: false,
  controls: false,
  currentTime: 0,
  height: undefined,
  loop: false,
  muted: false,
  pip: false,
  playbackRate: 1,
  playing: false,
  playsinline: false,
  preload: undefined,
  src: undefined,
  volume: 1,
  width: '100%',
};

export const defaultPropNames = Object.keys(defaultProps);

export const observedAttributes = defaultPropNames.map(kebabCase);
