
import { createBigNumber } from 'utils/create-big-number'

import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe(`modules/my-positions/actions/claim-trading-proceeds.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const Speedomatic = { bignum: () => {} }
      const AugurJS = {
        augur: {
          api: {
            ClaimTradingProceeds: { claimTradingProceeds: () => {} },
          },
        },
      }
      const LoadMarketsInfo = { loadMarketsInfo: () => {} }
      const GetWinningBalance = { getWinningBalance: () => {} }
      const UpdateAssets = {}
      const WinningPositions = sinon.stub().returns(t.selectors.winningPositions)
      const claimTradingProceeds = proxyquire('../../../src/modules/my-positions/actions/claim-trading-proceeds.js', {
        '../../../services/augurjs': AugurJS,
        '../../markets/actions/load-markets-info': LoadMarketsInfo,
        '../../portfolio/actions/get-winning-balance': GetWinningBalance,
        '../../auth/actions/update-assets': UpdateAssets,
        '../selectors/winning-positions': WinningPositions,
      }).default
      sinon.stub(Speedomatic, 'bignum').callsFake(n => createBigNumber(n, 10))
      sinon.stub(AugurJS.augur.api.ClaimTradingProceeds, 'claimTradingProceeds').callsFake((p) => {
        store.dispatch({ type: 'CLAIM_MARKETS_TRADING_PROCEEDS', _market: p._market })
        p.onSuccess(p.markets)
      })
      sinon.stub(LoadMarketsInfo, 'loadMarketsInfo').callsFake((marketIds, callback) => (dispatch, getState) => {
        dispatch({ type: 'LOAD_MARKETS_INFO', marketIds })
      })
      sinon.stub(GetWinningBalance, 'getWinningBalance').callsFake((marketIds, callback) => (dispatch, getState) => {
        dispatch({ type: 'GET_WINNING_BALANCE', marketIds })
      })
      UpdateAssets.updateAssets = sinon.stub().returns({ type: 'UPDATE_ASSETS' })
      store.dispatch(claimTradingProceeds())
      t.assertions(store.getActions())
      store.clearActions()
    })
  }

  test({
    description: 'no positions',
    state: {
      universe: {
        id: '0xb1',
        currentReportingWindowAddress: 7,
      },
      loginAccount: {
        address: '0xb0b',
      },
      outcomesData: {},
    },
    selectors: {
      winningPositions: [],
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    },
  })

  test({
    description: '1 position in closed market',
    state: {
      universe: {
        id: '0xb1',
        currentReportingWindowAddress: 7,
      },
      loginAccount: {
        address: '0xb0b',
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      winningPositions: [{
        id: '0xa1',
        description: 'test market 1',
        shares: '1',
      }],
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_TRADING_PROCEEDS',
        _market: '0xa1',
      }, {
        type: 'GET_WINNING_BALANCE',
        marketIds: ['0xa1'],
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIds: ['0xa1'],
      }])
    },
  })

  test({
    description: '1 position in open market',
    state: {
      universe: {
        id: '0xb1',
        currentReportingWindowAddress: 7,
      },
      loginAccount: {
        address: '0xb0b',
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      winningPositions: [],
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    },
  })

  test({
    description: '1 position in open market, 1 position in closed market',
    state: {
      universe: {
        id: '0xb1',
        currentReportingWindowAddress: 7,
      },
      loginAccount: {
        address: '0xb0b',
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa2': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      winningPositions: [{
        id: '0xa2',
        description: 'test market 2',
        shares: '1',
      }],
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_TRADING_PROCEEDS',
        _market: '0xa2',
      }, {
        type: 'GET_WINNING_BALANCE',
        marketIds: ['0xa2'],
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIds: ['0xa2'],
      }])
    },
  })

  test({
    description: '1 position in open market, 2 positions in closed markets',
    state: {
      universe: {
        id: '0xb1',
        currentReportingWindowAddress: 7,
      },
      loginAccount: {
        address: '0xb0b',
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa2': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa3': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      winningPositions: [{
        id: '0xa2',
        description: 'test market 2',
        shares: '1',
      }, {
        id: '0xa3',
        description: 'test market 3',
        shares: '1',
      }],
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_TRADING_PROCEEDS',
        _market: '0xa2',
      }, {
        type: 'GET_WINNING_BALANCE',
        marketIds: ['0xa2'],
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIds: ['0xa2'],
      }, {
        type: 'CLAIM_MARKETS_TRADING_PROCEEDS',
        _market: '0xa3',
      }, {
        type: 'GET_WINNING_BALANCE',
        marketIds: ['0xa3'],
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIds: ['0xa3'],
      }])
    },
  })

  test({
    description: '2 position in open markets, 1 position in closed market',
    state: {
      universe: {
        id: '0xb1',
        currentReportingWindowAddress: 7,
      },
      loginAccount: {
        address: '0xb0b',
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa2': {
          2: {
            sharesPurchased: '1',
          },
        },
        '0xa3': {
          2: {
            sharesPurchased: '1',
          },
        },
      },
    },
    selectors: {
      winningPositions: [{
        id: '0xa3',
        description: 'test market 3',
        shares: '1',
      }],
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_TRADING_PROCEEDS',
        _market: '0xa3',
      }, {
        type: 'GET_WINNING_BALANCE',
        marketIds: ['0xa3'],
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIds: ['0xa3'],
      }])
    },
  })
})
