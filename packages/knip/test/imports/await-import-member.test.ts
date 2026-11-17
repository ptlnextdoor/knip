import assert from 'node:assert/strict';
import test from 'node:test';
import { main } from '../../src/index.ts';
import baseCounters from '../helpers/baseCounters.ts';
import { createOptions } from '../helpers/create-options.ts';
import { resolve } from '../helpers/resolve.ts';

const cwd = resolve('fixtures/imports/await-import-member');

test('Track member access on awaited dynamic import', async () => {
  const options = await createOptions({ cwd });
  const { issues, counters } = await main(options);

  assert.deepEqual(Object.keys(issues.exports['provider.ts']), ['unused']);
  assert.deepEqual(counters, {
    ...baseCounters,
    exports: 1,
    processed: 2,
    total: 2,
  });
});
