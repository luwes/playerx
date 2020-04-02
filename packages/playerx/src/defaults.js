import { kebabCase } from './utils/index.js';

export const defaultProps = {
  src: undefined,
  width: '100%',
  height: undefined,
  aspectratio: 0.5625,
  controls: false,
  preview: undefined,
  preload: undefined,
  autoplay: false,
  loop: false,
  muted: false,
  playsinline: false,
  pip: false,
  playbackRate: 1,
};

export const defaultPropNames = Object.keys(defaultProps);

export const observedAttributes = defaultPropNames.map(kebabCase);
