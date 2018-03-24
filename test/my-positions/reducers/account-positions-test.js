

import accountPositions from 'modules/my-positions/reducers/account-positions'

import { UPDATE_ACCOUNT_POSITIONS_DATA } from 'modules/my-positions/actions/update-account-trades-data'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

describe('modules/my-positions/reducers/account-positions.js', () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions()
    })
  }

  test({
    description: `should return the default state`,
    assertions: () => {
      const actual = accountPositions(undefined, { type: null })
      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should return the default state for type: CLEAR_LOGIN_ACCOUNT`,
    assertions: () => {
      const actual = accountPositions({ test: 'test' }, { type: CLEAR_LOGIN_ACCOUNT })
      const expected = {}

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should update the state from the default state correctly`,
    assertions: () => {
      const actual = accountPositions(
        undefined,
        {
          type: UPDATE_ACCOUNT_POSITIONS_DATA,
          data: {
            '0xMARKETID1': {
              test: 'test',
            },
          },
          marketId: '0xMARKETID1',
        },
      )
      const expected = {
        '0xMARKETID1': {
          test: 'test',
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })

  test({
    description: `should update the state from existing state correctly`,
    assertions: () => {
      const actual = accountPositions(
        {
          '0xMARKETID2': {
            testing: 'testing',
          },
          '0xMARKETID1': {
            old: 'state',
          },
        },
        {
          type: UPDATE_ACCOUNT_POSITIONS_DATA,
          data: {
            '0xMARKETID1': {
              test: 'test',
            },
          },
          marketId: '0xMARKETID1',
        },
      )
      const expected = {
        '0xMARKETID2': {
          testing: 'testing',
        },
        '0xMARKETID1': {
          test: 'test',
        },
      }

      assert.deepEqual(actual, expected, `Didn't return the expected value`)
    },
  })
})
