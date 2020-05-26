import tape from 'tape';
import { beforeEach } from './_utils.js';
import { PlxPreview } from '../src/preview.js';

let container;

const test = beforeEach(tape, (assert) => {
  container = document.createElement('div');
  document.body.append(container);
  assert.end();
});

const src = 'https://vimeo.com/357274789';
const image = 'https://i.vimeocdn.com/video/810965406_960.jpg';

test('creates an element', (t) => {
  const player = new PlxPreview();
  t.assert(player instanceof HTMLElement);
  t.end();
});
