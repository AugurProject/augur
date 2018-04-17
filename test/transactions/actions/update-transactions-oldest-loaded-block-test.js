

import * as updateTransactionsOldestLoadedBlock from 'modules/transactions/actions/update-transactions-oldest-loaded-block'

describe('modules/transactions/actions/update-transactinos-oldest-loaded-block.js', () => {
  const test = t => it(t.description, () => t.assertions())

  describe('updateTransactionsOldestLoadedBlock', () => {
    test({
      description: `should return the expected object`,
      assertions: () => {
        const actual = updateTransactionsOldestLoadedBlock.updateTransactionsOldestLoadedBlock(123)

        const expected = {
          type: updateTransactionsOldestLoadedBlock.UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
          data: {
            block: 123,
          },
        }

        assert.deepEqual(actual, expected, `Didn't return the expected object`)
      },
    })
  })
})
