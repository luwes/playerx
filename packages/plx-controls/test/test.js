import test from 'tape';
import { PlxPreview } from '../src/preview.js';

// let container;
// const src = 'https://vimeo.com/357274789';
// const image = 'https://i.vimeocdn.com/video/810965406_960.jpg';

test('creates an element', (t) => {
  const player = new PlxPreview();
  t.assert(player instanceof HTMLElement);
  t.end();
});
