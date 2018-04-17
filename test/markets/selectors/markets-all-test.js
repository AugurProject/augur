

import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'
import marketsAssertions from 'assertions/markets'

// TODO -- should be refactored to use local state in requiring test
let allMarkets // eslint-disable-line import/no-mutable-exports

describe(`modules/markets/selectors/markets-all.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const state = Object.assign({}, testState, {
    marketsData: {
      test: {
        endTime: parseInt(new Date('01/01/3000').getTime() / 1000, 10),
        outcomes: {
          test: {},
        },
        volume: {
          value: 5,
        },
      },
      test2: {
        endTime: parseInt(new Date('01/01/3000').getTime() / 1000, 10),
        outcomes: {
          test2: {},
        },
        volume: {
          value: 10,
        },
      },
      test3: {
        endTime: parseInt(new Date('01/01/3000').getTime() / 1000, 10),
        outcomes: {
          test3: {},
        },
        volume: {
          value: 7,
        },
      },
    },
    priceHistory: {
      test: {},
      test2: {},
      test3: {},
    },
    favorites: {
      test: true,
      test2: true,
      test3: false,
    },
    reports: {
      testEvent: {
        id: 'testEvent',
      },
      testEvent2: {
        id: 'testEvent2',
      },
      testEvent3: {
        id: 'testEvent2',
      },
    },
    accountTrades: {
      test: {},
      test2: {},
      test3: {},
    },
    orderBooks: {
      test: {},
      test2: {},
      test3: {},
    },
    tradesInProgress: {
      test: {},
      test2: {},
      test3: {},
    },
  })
  const store = mockStore(state)
  const mockMarket = {
    selectMarket: () => {},
    selectMarketReport: () => {},
  }
  sinon.stub(mockMarket, 'selectMarket').callsFake((marketId, market, priceHistory, isMarketOpen, isMarketExpired, favorite, outcomes, reports, accountTrades, tradesInProgress, endYear, endMonth, endTime, isBlockchainReportPhase, marketOrderBook, orderCancellation, loginAccount, dispatch) => market)
  sinon.stub(mockMarket, 'selectMarketReport').callsFake((marketId, universeReports) => ({}))

  const selector = proxyquire('../../../src/modules/markets/selectors/markets-all.js', {
    '../../market/selectors/market': mockMarket,
    '../../../store': store,
  })

  allMarkets = selector.default

  it(`should return the correct selectedMarket function`, () => {
    const actual = selector.default()

    marketsAssertions(actual)
    assert(mockMarket.selectMarket.calledThrice, `selectMarket wasn't called 3 times as expected`)
  })
})

export default allMarkets
