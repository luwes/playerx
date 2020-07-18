import tape from 'tape';
import { beforeEach } from './_utils.js';
import { Playerx } from '../src/index.js';
import { coreMethodNames } from '../src/playerx.js';

const src = 'https://vimeo.com/357274789';
let container;

const test = beforeEach(tape, (assert) => {
  container = document.createElement('div');
  document.body.appendChild(container);
  assert.end();
});

test('methods are functions and return promises', (t) => {
  const player = new Playerx({ src });

  const testMethod = (methodName) => {
    t.equal(typeof player[methodName], 'function', `player.${methodName} is a function`);
    t.assert(player[methodName]() instanceof Promise, `player.${methodName}() returns a promise`);
  };

  coreMethodNames.forEach(testMethod);

  container.remove();

  t.end();
});
