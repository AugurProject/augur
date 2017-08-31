import { describe, it } from 'mocha'
import { assert } from 'chai'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { updateAccountName, UPDATE_ACCOUNT_NAME } from 'modules/account/actions/update-account-name'

describe('modules/account/actions/update-account-name', () => {
  const mockStore = configureMockStore([thunk])

  const test = t => it(t.description, () => {
    const store = mockStore({})

    t.assertions(store)
  })

  test({
    description: `should dispatch the expected action`,
    assertions: (store) => {
      store.dispatch(updateAccountName('testing'))

      const actual = store.getActions()

      const expected = [
        {
          type: UPDATE_ACCOUNT_NAME,
          data: {
            name: 'testing'
          }
        }
      ]

      assert.deepEqual(actual, expected, `didn't dispatch the expected actions`)
    }
  })
})
