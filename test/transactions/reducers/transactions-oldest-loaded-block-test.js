

import transactionsOldestLoadedBlock from 'modules/transactions/reducers/transactions-oldest-loaded-block'

import { UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK } from 'modules/transactions/actions/update-transactions-oldest-loaded-block'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

describe('modules/transactions/reducers/transactions-oldest-loaded-block', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = transactionsOldestLoadedBlock(undefined, {})

      const expected = null

      assert.strictEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should return the expected value for case UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK`,
    assertions: () => {
      const actual = transactionsOldestLoadedBlock(10000, {
        type: UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK,
        data: {
          block: 1,
        },
      })

      const expected = 1

      assert.strictEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should return the expected value for case CLEAR_LOGIN_ACCOUNT`,
    assertions: () => {
      const actual = transactionsOldestLoadedBlock(10000, {
        type: CLEAR_LOGIN_ACCOUNT,
      })

      const expected = null

      assert.strictEqual(actual, expected, `Didn't return the expected value`)
    },
  })
})
