

import * as updateTransactionsLoading from 'modules/transactions/actions/update-transactions-loading'

describe('modules/transactions/actions/update-transactinos-loading.js', () => {
  const test = t => it(t.description, () => t.assertions())

  describe('updateTransactionsLoading', () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateTransactionsLoading.updateTransactionsLoading('testing')

        const expected = {
          type: updateTransactionsLoading.UPDATE_TRANSACTIONS_LOADING,
          data: {
            isLoading: 'testing',
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })
})
