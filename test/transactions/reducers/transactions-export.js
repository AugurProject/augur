import { describe, it } from 'mocha';
import { assert } from 'chai';

import transactionsExport from 'modules/transactions/reducers/transactions-export';

import { UPDATE_WILL_EXPORT_TRANSACTIONS } from 'modules/transactions/actions/trigger-transactions-export';

describe('modules/transactions/reducers/transactions-export', () => {
  const test = t => it(t.description, () => t.assertions());

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = transactionsExport(undefined, {});

      const expected = false;

      assert.strictEqual(actual, expected, `Didn't return the expected value`);
    }
  });

  test({
    description: `should return the expected value for case UPDATE_WILL_EXPORT_TRANSACTIONS`,
    assertions: () => {
      const actual = transactionsExport(false, {
        type: UPDATE_WILL_EXPORT_TRANSACTIONS,
        data: {
          willExportTransactions: true
        }
      });

      const expected = true;

      assert.strictEqual(actual, expected, `Didn't return the expected value`);
    }
  });
});
