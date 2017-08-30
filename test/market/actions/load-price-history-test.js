import { describe, it } from 'mocha'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/market/actions/load-price-history.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const state = Object.assign({}, testState)
  const store = mockStore(state)
  const mockAugurJS = { augur: { logs: {} } }
  mockAugurJS.augur.logs.getMarketPriceHistory = sinon.stub()

  const action = proxyquire('../../../src/modules/market/actions/load-price-history', {
    '../../../services/augurjs': mockAugurJS
  })

  it(`should call AugurJS getMarketPriceHistory`, () => {
    store.dispatch(action.loadPriceHistory('testMarketID'))
    sinon.assert.calledOnce(mockAugurJS.augur.logs.getMarketPriceHistory)
  })
})
