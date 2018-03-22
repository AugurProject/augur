

import transactionsLoading from 'modules/transactions/reducers/transactions-loading'

import { UPDATE_TRANSACTIONS_LOADING } from 'modules/transactions/actions/update-transactions-loading'

describe('modules/transactions/reducers/transactions-loading', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = transactionsLoading(undefined, {})

      const expected = false

      assert.strictEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should return the expected value for case UPDATE_TRANSACTIONS_LOADING`,
    assertions: () => {
      const actual = transactionsLoading(false, {
        type: UPDATE_TRANSACTIONS_LOADING,
        data: {
          isLoading: true,
        },
      })

      const expected = true

      assert.strictEqual(actual, expected, `Didn't return the expected value`)
    },
  })
})
