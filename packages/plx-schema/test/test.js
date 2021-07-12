import test from 'tape';
import { secondsToISOString } from '../src/utils.js';

test('secondsToISOString', (t) => {
  t.equal(secondsToISOString(0), 'P0D');
  t.equal(secondsToISOString(120), 'PT2M');
  t.equal(secondsToISOString(3601), 'PT1H1S');
  t.equal(secondsToISOString(1), 'PT1S');
  t.equal(secondsToISOString(5410), 'PT1H30M10S');
  t.equal(secondsToISOString(37226652), 'P1Y2M4DT20H44M12S');
  t.equal(secondsToISOString(37313052), 'P1Y2M5DT20H44M12S');
  t.end();
});
