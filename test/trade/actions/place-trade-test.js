import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import * as mocks from 'test/mockStore'
import { tradeTestState } from 'test/trade/constants'

describe(`modules/trade/actions/place-trade.js`, () => {
  proxyquire.noPreserveCache()
  it('should handle a null/undefined outcomeId', () => {
    const { state, mockStore } = mocks.default
    const testState = { ...state, ...tradeTestState }
    testState.loginAccount = { privateKey: Buffer.from('PRIVATE_KEY', 'utf8') }
    const store = mockStore(testState)
    const SelectMarket = { selectMarket: () => {} }
    sinon.stub(SelectMarket, 'selectMarket').callsFake(marketId => store.getState().marketsData[marketId])
    const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
      '../../market/selectors/market': SelectMarket
    })
    store.dispatch(action.placeTrade('testBinaryMarketId', null))
    assert.deepEqual(store.getActions(), [{
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketId: 'testBinaryMarketId'
    }], `Didn't produce the expected actions for passing a null outcomeId to place-trade`)
    store.clearActions()
    store.dispatch(action.placeTrade('testBinaryMarketId', undefined))
    assert.deepEqual(store.getActions(), [{
      type: 'CLEAR_TRADE_IN_PROGRESS',
      marketId: 'testBinaryMarketId'
    }], `Didn't produce the expected actions for passing a undefined outcomeId to place-trade`)
  })
  it('should handle a null/undefined marketId', () => {
    const { state, mockStore } = mocks.default
    const testState = { ...state, ...tradeTestState }
    testState.loginAccount = { privateKey: Buffer.from('PRIVATE_KEY', 'utf8') }
    const store = mockStore(testState)
    const SelectMarket = { selectMarket: () => {} }
    sinon.stub(SelectMarket, 'selectMarket').callsFake(marketId => store.getState().marketsData[marketId])
    const action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
      '../../market/selectors/market': SelectMarket
    })
    store.dispatch(action.placeTrade(null, '1'))
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a null marketId to place-trade`)
    store.clearActions()
    store.dispatch(action.placeTrade(undefined, '1'))
    assert.deepEqual(store.getActions(), [], `Didn't fail out as expected for passing a undefined marketId to place-trade`)
  })
})
