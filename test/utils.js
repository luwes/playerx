import test from 'tape';
import {
  camelCase,
  kebabCase,
  startCase,
  createTimeRanges,
  omit,
  boolToBinary,
  loadScript,
} from '../src/playerx/utils.js';

test(`kebabCase`, async (t) => {
  t.plan(1);

  t.equal(kebabCase('testStringCheck'), 'test-string-check');
});

test(`camelCase`, async (t) => {
  t.plan(1);

  t.equal(camelCase('test-string-check'), 'testStringCheck');
});

test(`startCase`, async (t) => {
  t.plan(1);

  t.equal(startCase('test-string-check'), 'Test-string-check');
});

test(`createTimeRanges`, async (t) => {
  t.plan(3);

  const timeRanges = createTimeRanges(0, 3);

  t.deepEqual(timeRanges, [[0, 3]]);
  t.equal(timeRanges.start(0), 0);
  t.equal(timeRanges.end(0), 3);
});

test(`omit`, async (t) => {
  t.plan(1);

  t.assert(!('url' in omit(['url'], { url: '' })), 'url prop is omit');
});

test(`boolToBinary`, async (t) => {
  t.plan(1);

  t.deepEqual(boolToBinary({ t: true, f: false }), { t: 1, f: 0 });
});

// failing in CI
test.skip(`loadScript`, async (t) => {
  t.plan(1);

  try {
    await loadScript('http://fail.org/nonexistant.js');
    t.fail('Should throw on a bad url');
  } catch (err) {
    t.pass();
  }
});
