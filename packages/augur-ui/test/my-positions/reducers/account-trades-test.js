

import accountTrades from 'modules/my-positions/reducers/account-trades'

import { UPDATE_ACCOUNT_TRADES_DATA } from 'modules/my-positions/actions/update-account-trades-data'
import { CLEAR_ACCOUNT_TRADES } from 'modules/my-positions/actions/clear-account-trades'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

describe('modules/my-positions/reducers/account-trades.js', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = accountTrades(undefined, { type: null })
      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should return the default state for type: CLEAR_LOGIN_ACCOUNT`,
    assertions: () => {
      const actual = accountTrades({ test: 'test' }, { type: CLEAR_LOGIN_ACCOUNT })
      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should return the default state for type: CLEAR_ACCOUNT_TRADES`,
    assertions: () => {
      const actual = accountTrades({ test: 'test' }, { type: CLEAR_ACCOUNT_TRADES })
      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should update the state from the default state correctly`,
    assertions: () => {
      const actual = accountTrades(
        undefined,
        {
          type: UPDATE_ACCOUNT_TRADES_DATA,
          data: {
            1: [
              {
                transactionHash: '0xTRANSACTIONHASH1',
              },
            ],
          },
          market: '0xMARKETID1',
        },
      )
      const expected = {
        '0xMARKETID1': {
          1: [
            {
              transactionHash: '0xTRANSACTIONHASH1',
            },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should update the state correctly from state WITH matching trades`,
    assertions: () => {
      const actual = accountTrades(
        {
          '0xMARKETID2': {
            2: [
              {
                transactionHash: '0x2TRANSACTIONHASH2',
              },
              {
                transactionHash: '0x2TRANSACTIONHASH1',
              },
            ],
          },
          '0xMARKETID1': {
            1: [
              {
                transactionHash: '0xTRANSACTIONHASH2',
              },
              {
                transactionHash: '0xTRANSACTIONHASH1',
              },
            ],
          },
        },
        {
          type: UPDATE_ACCOUNT_TRADES_DATA,
          data: {
            1: [
              {
                transactionHash: '0xTRANSACTIONHASH1',
              },
            ],
          },
          market: '0xMARKETID1',
        },
      )
      const expected = {
        '0xMARKETID2': {
          2: [
            {
              transactionHash: '0x2TRANSACTIONHASH2',
            },
            {
              transactionHash: '0x2TRANSACTIONHASH1',
            },
          ],
        },
        '0xMARKETID1': {
          1: [
            {
              transactionHash: '0xTRANSACTIONHASH2',
            },
            {
              transactionHash: '0xTRANSACTIONHASH1',
            },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should update the state correctly from state WITHOUT matching trades`,
    assertions: () => {
      const actual = accountTrades(
        {
          '0xMARKETID2': {
            2: [
              {
                transactionHash: '0x2TRANSACTIONHASH2',
              },
              {
                transactionHash: '0x2TRANSACTIONHASH1',
              },
            ],
          },
          '0xMARKETID1': {
            1: [
              {
                transactionHash: '0xTRANSACTIONHASH2',
              },
              {
                transactionHash: '0xTRANSACTIONHASH1',
              },
            ],
          },
        },
        {
          type: UPDATE_ACCOUNT_TRADES_DATA,
          data: {
            1: [
              {
                transactionHash: '0xTRANSACTIONHASH3',
              },
            ],
          },
          market: '0xMARKETID1',
        },
      )
      const expected = {
        '0xMARKETID2': {
          2: [
            {
              transactionHash: '0x2TRANSACTIONHASH2',
            },
            {
              transactionHash: '0x2TRANSACTIONHASH1',
            },
          ],
        },
        '0xMARKETID1': {
          1: [
            {
              transactionHash: '0xTRANSACTIONHASH2',
            },
            {
              transactionHash: '0xTRANSACTIONHASH1',
            },
            {
              transactionHash: '0xTRANSACTIONHASH3',
            },
          ],
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })
})
