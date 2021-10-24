import test from 'tape';
import { Playerx } from '../src/playerx/index.js';

const src = 'https://vimeo.com/638369396';

test('creates an element', (t) => {
  const player = new Playerx();
  t.assert(player instanceof HTMLElement);
  t.end();
});

test('methods are functions and return promises', (t) => {
  const player = new Playerx({ src });

  const testMethod = (methodName) => {
    t.equal(
      typeof player[methodName],
      'function',
      `player.${methodName} is a function`
    );
    t.assert(
      player[methodName]() instanceof Promise,
      `player.${methodName}() returns a promise`
    );
  };

  ['play', 'pause', 'get'].forEach(testMethod);

  t.end();
});
