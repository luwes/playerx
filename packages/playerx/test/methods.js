import tape from 'tape';
import { beforeEach } from './_utils.js';
import Playerx from '../src/index.js';
import { coreMethodNames } from '../src/playerx.js';
import { defaultPropNames } from '../src/defaults.js';
import { getName, setName } from '../src/helpers/index.js';

const src = 'https://vimeo.com/357274789';
let container;

const test = beforeEach(tape, (assert) => {
  container = document.createElement('div');
  document.body.append(container);
  assert.end();
});

test('methods are functions and return promises', (t) => {
  const player = new Playerx({ src });

  const testMethod = (methodName) => {
    t.equal(typeof player[methodName], 'function', `player.${methodName} is not a function`);
    t.assert(player[methodName]() instanceof Promise, `player.${methodName}() does not return a promise`);
  };

  coreMethodNames.forEach(testMethod);
  defaultPropNames.forEach(name => testMethod(getName(name)));
  defaultPropNames.forEach(name => testMethod(setName(name)));

  t.end();
});
