

import proxyquire from 'proxyquire'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/transactions/actions/update-transactions-data.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  let out
  const state = Object.assign({}, testState)
  const store = mockStore(state)
  const action = proxyquire('../../../src/modules/transactions/actions/update-transactions-data', {})
  it(`should fire update and process transaction actions`, () => {
    out = [{
      type: 'UPDATE_TRANSACTIONS_DATA',
      transactionsData: {
        test: 'testTransactionData',
      },
    }]
    store.dispatch(action.updateTransactionsData({
      test: 'testTransactionData',
    }))
    assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`)
  })
})
