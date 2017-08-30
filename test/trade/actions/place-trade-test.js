import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import * as mocks from 'test/mockStore'
import { tradeTestState } from 'test/trade/constants'

describe(`modules/trade/actions/place-trade.js`, () => {
  proxyquire.noPreserveCache()
  it('should handle a null/undefined outcomeID', () => {
    const { state, mockStore } = mocks.default
    const testState = { ...state, ...tradeTestState }
    testState.loginAccount = { privateKey: Buffer.from('PRIVATE_KEY', 'utf8') }
    const store = mockStore(testState)
    const SelectMarket = { selectMarket: () => {} }
    sinon.stub(SelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID])
    const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
      '../../market/selectors/market': SelectMarket
    })
    store.dispatch(action.placeTrade('testBinaryMarketID', null))
    assert.deepEqual(store.getActions(), [{
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketID: 'testBinaryMarketID'
    }], `Didn't produce the expected actions for passing a null outcomeID to place-trade`)
    store.clearActions()
    store.dispatch(action.placeTrade('testBinaryMarketID', undefined))
    assert.deepEqual(store.getActions(), [{
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketID: 'testBinaryMarketID'
    }], `Didn't produce the expected actions for passing a undefined outcomeID to place-trade`)
  })
  it('should handle a null/undefined marketID', () => {
    const { state, mockStore } = mocks.default
    const testState = { ...state, ...tradeTestState }
    testState.loginAccount = { privateKey: Buffer.from('PRIVATE_KEY', 'utf8') }
    const store = mockStore(testState)
    const SelectMarket = { selectMarket: () => {} }
    sinon.stub(SelectMarket, 'selectMarket', marketID => store.getState().marketsData[marketID])
    const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
      '../../market/selectors/market': SelectMarket
    })
    store.dispatch(action.placeTrade(null, '1'))
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a null marketID to place-trade`)
    store.clearActions()
    store.dispatch(action.placeTrade(undefined, '1'))
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a undefined marketID to place-trade`)
  })
})
