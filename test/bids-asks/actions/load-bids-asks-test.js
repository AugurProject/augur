import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import mocks from 'test/mockStore'

describe(`modules/bids-asks/actions/load-bids-asks.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const getOrderBookChunkedStub = sinon.stub().yields({})
  const augurJsMock = {
    augur: {
      trading: {
        orderBook: {
          getOrderBookChunked: getOrderBookChunkedStub
        }
      }
    }
  }
  const updateMarketOrderBookModule = {
    updateMarketOrderBook: mocks.actionCreator(),
    clearMarketOrderBook: mocks.actionCreator()
  }
  const store = mocks.store
  const loadBidsAsksModule = proxyquire('../../../src/modules/bids-asks/actions/load-bids-asks', {
    '../../../services/augurjs': augurJsMock,
    './update-market-order-book': updateMarketOrderBookModule,
    '../../../store': store
  })

  beforeEach(() => {
    store.clearActions()
    augurJsMock.augur.trading.orderBook.getOrderBookChunked.reset()
    updateMarketOrderBookModule.updateMarketOrderBook.reset()
    updateMarketOrderBookModule.clearMarketOrderBook.reset()
  })

  describe('loadBidsAsks', () => {
    it(`should load orders for a market`, () => {
      store.dispatch(loadBidsAsksModule.loadBidsAsks('testMarketID', 0, null, {}, (orderBookChunk) => {}))
      const expectedActions = [{
        type: 'MOCK_ACTION'
      }, {
        type: 'MOCK_ACTION'
      }]
      assert.deepEqual(store.getActions(), expectedActions)
      sinon.assert.calledOnce(augurJsMock.augur.trading.orderBook.getOrderBookChunked)
      sinon.assert.calledOnce(updateMarketOrderBookModule.updateMarketOrderBook)
      sinon.assert.calledOnce(updateMarketOrderBookModule.clearMarketOrderBook)
    })
  })
})
