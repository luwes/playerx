import tape from 'tape';
import spy from 'ispy';
import { beforeEach } from './_utils.js';
import Playerx from '../src/index.js';

const src = 'https://vimeo.com/357274789';
let container;

const test = beforeEach(tape, (assert) => {
  container = document.createElement('div');
  document.body.append(container);
  assert.end();
});

test('creates an element', (t) => {
  const player = new Playerx({ src });
  t.assert(player instanceof HTMLElement);
  t.end();
});

test('custom element lifecycle callbacks work', (t) => {
  const player = new Playerx({ src });

  player._connected = spy();
  container.append(player);
  t.equal(player._connected.callCount, 1, 'connected called');

  player._attributeChanged = spy();
  player.setAttribute('width', 640);

  player._disconnected = spy();
  player.remove();
  t.equal(player._disconnected.callCount, 1, 'disconnected called');

  t.equal(player._attributeChanged.callCount, 1, 'attribute changed called');
  t.end();
});

