import { createElement } from '../utils/dom.js';

export const allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';

export function createEmbedIframe({ src, ...props }) {
  return createElement('iframe', {
    src,
    width: '100%',
    height: '100%',
    allow,
    allowFullscreen: true,
    frameBorder: 0,
    ...props,
  });
}
