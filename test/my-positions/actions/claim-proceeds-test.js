import { describe, it } from 'mocha'
import BigNumber from 'bignumber.js'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

describe(`modules/my-positions/actions/claim-proceeds.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)
      const AugurJS = {
        augur: {
          trading: { payout: { claimMarketsProceeds: () => {} } }
        },
        abi: { bignum: () => {} }
      }
      const LoadAccountTrades = { loadAccountTrades: () => {} }
      const LoadMarketsInfo = { loadMarketsInfo: () => {} }
      const UpdateAssets = {}
      const WinningPositions = sinon.stub().returns(t.selectors.winningPositions)
      const action = proxyquire('../../../src/modules/my-positions/actions/claim-proceeds.js', {
        '../../../services/augurjs': AugurJS,
        './load-account-trades': LoadAccountTrades,
        '../../markets/actions/load-markets-info': LoadMarketsInfo,
        '../../auth/actions/update-assets': UpdateAssets,
        '../selectors/winning-positions': WinningPositions
      })
      sinon.stub(AugurJS.abi, 'bignum', n => new BigNumber(n, 10))
      sinon.stub(AugurJS.augur.trading.payout, 'claimMarketsProceeds', (branchID, markets, cb) => {
        store.dispatch({ type: 'CLAIM_MARKETS_PROCEEDS', markets })
        cb(null, markets.map(market => market.id))
      })
      sinon.stub(LoadAccountTrades, 'loadAccountTrades', (options, cb) => (dispatch, getState) => {
        dispatch({ type: 'LOAD_ACCOUNT_TRADES', ...options })
        cb(null)
      })
      sinon.stub(LoadMarketsInfo, 'loadMarketsInfo', (marketIDs, cb) => (dispatch, getState) => {
        dispatch({ type: 'LOAD_MARKETS_INFO', marketIDs })
        cb(null)
      })
      UpdateAssets.updateAssets = sinon.stub().returns({ type: 'UPDATE_ASSETS' })
      store.dispatch(action.claimProceeds())
      t.assertions(store.getActions())
      store.clearActions()
    })
  }

  test({
    description: 'no positions',
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0xb0b'
      },
      outcomesData: {}
    },
    selectors: {
      winningPositions: []
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })

  test({
    description: '1 position in closed market',
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0xb0b'
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1'
          }
        }
      }
    },
    selectors: {
      winningPositions: [{
        id: '0xa1',
        description: 'test market 1',
        shares: '1'
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_PROCEEDS',
        markets: [{
          id: '0xa1',
          description: 'test market 1',
          shares: '1'
        }]
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIDs: ['0xa1'],
      }, {
        type: 'LOAD_ACCOUNT_TRADES',
        market: '0xa1',
      }])
    }
  })

  test({
    description: '1 position in open market',
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0xb0b'
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1'
          }
        }
      }
    },
    selectors: {
      winningPositions: []
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [])
    }
  })

  test({
    description: '1 position in open market, 1 position in closed market',
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0xb0b'
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1'
          }
        },
        '0xa2': {
          2: {
            sharesPurchased: '1'
          }
        }
      }
    },
    selectors: {
      winningPositions: [{
        id: '0xa2',
        description: 'test market 2',
        shares: '1'
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_PROCEEDS',
        markets: [{
          id: '0xa2',
          description: 'test market 2',
          shares: '1'
        }]
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIDs: ['0xa2'],
      }, {
        type: 'LOAD_ACCOUNT_TRADES',
        market: '0xa2',
      }])
    }
  })

  test({
    description: '1 position in open market, 2 positions in closed markets',
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0xb0b'
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1'
          }
        },
        '0xa2': {
          2: {
            sharesPurchased: '1'
          }
        },
        '0xa3': {
          2: {
            sharesPurchased: '1'
          }
        }
      }
    },
    selectors: {
      winningPositions: [{
        id: '0xa2',
        description: 'test market 2',
        shares: '1'
      }, {
        id: '0xa3',
        description: 'test market 3',
        shares: '1'
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_PROCEEDS',
        markets: [{
          id: '0xa2',
          description: 'test market 2',
          shares: '1'
        }, {
          id: '0xa3',
          description: 'test market 3',
          shares: '1'
        }]
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIDs: ['0xa2'],
      }, {
        type: 'LOAD_ACCOUNT_TRADES',
        market: '0xa2',
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIDs: ['0xa3'],
      }, {
        type: 'LOAD_ACCOUNT_TRADES',
        market: '0xa3',
      }])
    }
  })

  test({
    description: '2 position in open markets, 1 position in closed market',
    state: {
      branch: {
        id: '0xb1',
        reportPeriod: 7
      },
      loginAccount: {
        address: '0xb0b'
      },
      outcomesData: {
        '0xa1': {
          2: {
            sharesPurchased: '1'
          }
        },
        '0xa2': {
          2: {
            sharesPurchased: '1'
          }
        },
        '0xa3': {
          2: {
            sharesPurchased: '1'
          }
        }
      }
    },
    selectors: {
      winningPositions: [{
        id: '0xa3',
        description: 'test market 3',
        shares: '1'
      }]
    },
    assertions: (actions) => {
      assert.deepEqual(actions, [{
        type: 'CLAIM_MARKETS_PROCEEDS',
        markets: [{
          id: '0xa3',
          description: 'test market 3',
          shares: '1'
        }]
      }, {
        type: 'UPDATE_ASSETS'
      }, {
        type: 'LOAD_MARKETS_INFO',
        marketIDs: ['0xa3'],
      }, {
        type: 'LOAD_ACCOUNT_TRADES',
        market: '0xa3',
      }])
    }
  })
})
