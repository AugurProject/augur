

import proxyquire from 'proxyquire'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/app/actions/update-blockchain.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const state = Object.assign({}, testState)
  const store = mockStore(state)
  const action = proxyquire('../../../src/modules/app/actions/update-blockchain.js', {})
  it('should dispatch UPDATE_BLOCKCHAIN action', () => {
    store.dispatch(action.updateBlockchain({
      currentBlockNumber: 10000,
      currentBlockTimestamp: 4886718345,
    }))
    assert.deepEqual(store.getActions(), [{
      type: 'UPDATE_BLOCKCHAIN',
      data: {
        currentBlockNumber: 10000,
        currentBlockTimestamp: 4886718345,
      },
    }])
    store.clearActions()
  })
})
