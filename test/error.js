import test from 'tape';
import { PlayerError } from '../src/playerx/helpers.js';

test(`PlayerError`, async (t) => {

  const error = new PlayerError(1, 'The operation was aborted.');
  t.equal(error.code, 1);
  t.equal(error.message, 'The operation was aborted.');
  t.assert(error instanceof Error);

  t.end();
});
