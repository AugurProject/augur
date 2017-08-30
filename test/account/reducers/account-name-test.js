import { describe, it } from 'mocha'
import { assert } from 'chai'

import accountName from 'modules/account/reducers/account-name'

import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { UPDATE_ACCOUNT_NAME } from 'modules/account/actions/update-account-name'

describe('modules/account/reducers/account-name.js', () => {
  const test = t => it(t.description, () => t.assertions())

  test({
    description: `should return the DEFAULT_STATE when no type is specified`,
    assertions: () => {
      const actual = accountName(undefined, {})

      const expected = null

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })

  test({
    description: `should return the DEFAULT_STATE when type is 'CLEAR_LOGIN_ACCOUNT' is specified`,
    assertions: () => {
      const actual = accountName('testing', {
        type: CLEAR_LOGIN_ACCOUNT
      })

      const expected = null

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })

  test({
    description: `should return the updated state when type is 'UPDATE_ACCOUNT_NAME'`,
    assertions: () => {
      const actual = accountName(undefined, {
        type: UPDATE_ACCOUNT_NAME,
        data: {
          name: 'testing'
        }
      })

      const expected = 'testing'

      assert.strictEqual(actual, expected, `didn't return the expected value`)
    }
  })
})
