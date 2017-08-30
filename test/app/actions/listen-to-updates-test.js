import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import testState from 'test/testState'

describe(`modules/app/actions/listen-to-updates.js`, () => {
  proxyquire.noPreserveCache().noCallThru()

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const state = testState
  const store = mockStore(state)
  const AugurJS = {
    augur: {
      filters: {
        listen: () => {}
      },
      CompositeGetters: {
        getPositionInMarket: sinon.stub.yields(['0x0', '0x1'])
      }
    },
    abi: {
      number: sinon.stub().returns([0, 1]),
      bignum: () => {}
    }
  }

  const SyncBlockchain = {
    syncBlockchain: sinon.stub().returns({ type: 'SYNC_BLOCKCHAIN' })
  }

  const SyncBranch = {
    syncBranch: sinon.stub().returns({ type: 'SYNC_BRANCH' })
  }

  const UpdateBranch = {
    updateBranch: sinon.stub().returns({ type: 'UPDATE_BRANCH' })
  }

  const UpdateAssets = {
    updateAssets: sinon.stub().returns({ type: 'UPDATE_ASSETS' })
  }

  const OutcomePrice = {
    updateOutcomePrice: sinon.stub().returns({ type: 'UPDATE_OUTCOME_PRICE' })
  }

  const LoadMarketsInfo = {
    loadMarketsInfo: sinon.stub().returns({ type: 'LOAD_MARKETS_INFO' })
  }

  const UpdateMarketOrderBook = {
    addOrder: sinon.stub().returns({ type: 'ADD_ORDER' }),
    fillOrder: sinon.stub().returns({ type: 'FILL_ORDER' }),
    removeOrder: sinon.stub().returns({ type: 'REMOVE_ORDER' })
  }

  const UpdateTopics = {
    updateMarketTopicPopularity: sinon.stub().returns({ type: 'UPDATE_MARKET_TOPIC_POPULARITY' })
  }

  const ConverLogsToTransactions = {
    convertLogsToTransactions: sinon.stub().returns({ type: 'CONVERT_LOGS_TO_TRANSACTIONS' })
  }

  const UpdateAccountTradesData = {
    updateAccountBidsAsksData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_BIDS_ASKS_DATA' }),
    updateAccountCancelsData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_CANCELS_DATA' }),
    updateAccountTradesData: sinon.stub().returns({ type: 'UPDATE_ACCOUNT_TRADES_DATA' })
  }

  const action = proxyquire('../../../src/modules/app/actions/listen-to-updates.js', {
    '../../../services/augurjs': AugurJS,
    '../../branch/actions/sync-branch': SyncBranch,
    '../../branch/actions/update-branch': UpdateBranch,
    './sync-blockchain': SyncBlockchain,
    '../../auth/actions/update-assets': UpdateAssets,
    '../../markets/actions/update-outcome-price': OutcomePrice,
    '../../markets/actions/load-markets-info': LoadMarketsInfo,
    '../../bids-asks/actions/update-market-order-book': UpdateMarketOrderBook,
    '../../topics/actions/update-topics': UpdateTopics,
    '../../transactions/actions/convert-logs-to-transactions': ConverLogsToTransactions,
    '../../my-positions/actions/update-account-trades-data': UpdateAccountTradesData
  })

  beforeEach(() => {
    store.clearActions()
  })

  afterEach(() => {
    AugurJS.augur.filters.listen.restore()
  })

  const test = (t) => {
    it(t.description, () => {
      t.assertions(store)
    })
  }

  test({
    description: 'should dispatch expected actions from block callback',
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.block('blockhash')
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'SYNC_BLOCKCHAIN'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'SYNC_BRANCH'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from collectedFees callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.collectedFees({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from collectedFees callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.collectedFees({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from payout callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.payout({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from payout callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.payout({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from penalizationCatchUp callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.penalizationCaughtUp({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from penalizationCatchUp callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.penalizationCaughtUp({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from penalize callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.penalize({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from penalize callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.penalize({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from registration callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.registration({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from registration callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.registration({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from submittedReport callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.submittedReport({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from submittedReport callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.submittedReport({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from submittedReportHash callback if sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.submittedReportHash({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from submittedReportHash callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.submittedReportHash({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from slashedRep callback if sender IS NOT logged user OR reporter`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.slashedRep({
          sender: '0xNOTUSER',
          reporter: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from slashedRep callback if sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.slashedRep({
          sender: '0x0000000000000000000000000000000000000001',
          reporter: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from slashedRep callback if reporter IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.slashedRep({
          sender: '0xNOTUSER',
          reporter: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from log_fill_tx callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_fill_tx({})
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_fill_tx callback WITH correct argument properties AND sender AND owner ARE NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_fill_tx({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0xNOTUSER',
          owner: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'FILL_ORDER'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_fill_tx callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_fill_tx({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0x0000000000000000000000000000000000000001',
          owner: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'UPDATE_ACCOUNT_TRADES_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_fill_tx callback WITH correct argument properties AND owner IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_fill_tx({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0xNOTUSER',
          owner: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'FILL_ORDER'
        },
        {
          type: 'UPDATE_ACCOUNT_TRADES_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from log_short_fill_tx callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_short_fill_tx({})
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_short_fill_tx callback WITH correct argument properties AND sender AND owner ARE NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_short_fill_tx({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0xNOTUSER',
          owner: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'FILL_ORDER'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_short_fill_tx callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_short_fill_tx({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0x0000000000000000000000000000000000000001',
          owner: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'UPDATE_ACCOUNT_TRADES_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_shrot_fill_tx callback WITH correct argument properties AND owner IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_short_fill_tx({
          market: '0xMARKET',
          price: '0.2',
          outcome: '1',
          sender: '0xNOTUSER',
          owner: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_OUTCOME_PRICE'
        },
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        },
        {
          type: 'FILL_ORDER'
        },
        {
          type: 'UPDATE_ACCOUNT_TRADES_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from log_add_tx callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_add_tx({})
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_add_tx callback WITH correct argument properties AND NOT short ask AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_add_tx({
          market: '0xMARKET',
          outcome: '1',
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_add_tx callback WITH correct argument properties AND IS short ask AND market exists AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_add_tx({
          market: 'testMarketID2',
          outcome: '1',
          amount: '0.2',
          isShortAsk: true,
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_add_tx callback WITH correct argument properties AND IS short ask AND market DOES NOT exist AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_add_tx({
          market: 'testMarketID3',
          outcome: '1',
          amount: '0.2',
          isShortAsk: true,
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_add_tx callback WITH correct argument properties AND NOT short ask AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_add_tx({
          market: 'testMarketID3',
          outcome: '1',
          amount: '0.2',
          isShortAsk: false,
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ACCOUNT_BIDS_ASKS_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from log_cancel callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_cancel({})
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_cancel callback WITH correct argument properties AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_cancel({
          market: '0xMARKET',
          outcome: '1',
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from log_cancel callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.log_cancel({
          market: '0xMARKET',
          outcome: '1',
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ACCOUNT_CANCELS_DATA'
        },
        {
          type: 'UPDATE_ASSETS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from completeSets_logReturn callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.completeSets_logReturn()
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from completeSets_logReturn callback WITH correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.completeSets_logReturn({
          amount: '10',
          numOutcomes: '2'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_MARKET_TOPIC_POPULARITY'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from marketCreated callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.marketCreated()
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from marketCreated callback WITH correct argument properties AND sender IS NOT logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.marketCreated({
          marketID: '0xMARKET',
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from marketCreated callback WITH correct argument properties AND sender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.marketCreated({
          marketID: '0xMARKET',
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from tradingFeeUpdated callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.tradingFeeUpdated()
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from tradingFeeUpdated callback WITH correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.tradingFeeUpdated({
          marketID: '0xMARKET'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        },
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from deposit callback WITHOUT sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.deposit({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from deposit callback WITH sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.deposit({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from deposit callback WITHOUT sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.withdraw({
          sender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from deposit callback WITH sender as logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.withdraw({
          sender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from sentCash callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.sentCash()
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from sentCash callback WITH correct argument properties AND _from IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.sentCash({
          _from: '0x0000000000000000000000000000000000000001',
          _to: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from sentCash callback WITH correct argument properties AND _to IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.sentCash({
          _from: '0xNOTUSER',
          _to: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from Transfer callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.Transfer()
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from Transfer callback WITH correct argument properties AND _from IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.Transfer({
          _from: '0x0000000000000000000000000000000000000001',
          _to: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from Transfer callback WITH correct argument properties AND _to IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.Transfer({
          _from: '0xNOTUSER',
          _to: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from Approval callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.Approval()
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from Approval callback WITH correct argument properties AND _owner IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.Approval({
          _owner: '0x0000000000000000000000000000000000000001',
          _spender: '0xNOTUSER'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from Approval callback WITH correct argument properties AND _spender IS logged user`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.Approval({
          _owner: '0xNOTUSER',
          _spender: '0x0000000000000000000000000000000000000001'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'UPDATE_ASSETS'
        },
        {
          type: 'CONVERT_LOGS_TO_TRANSACTIONS'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from closedMarket callback WITHOUT correct argument properties`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.closedMarket()
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should NOT dispatch actions from closedMarket callback WITHOUT matched branch`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.closedMarket({
          market: '0xMARKET',
          branch: '0xNOTMATCH'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = []

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })

  test({
    description: `should dispatch actions from closedMarket callback WITH matched branch`,
    assertions: (store) => {
      sinon.stub(AugurJS.augur.filters, 'listen', (contractAddresses, eventsAPI, cb) => {
        cb.closedMarket({
          market: '0xMARKET',
          branch: '0xf69b5'
        })
      })

      store.dispatch(action.listenToUpdates())

      const expected = [
        {
          type: 'LOAD_MARKETS_INFO'
        }
      ]

      assert.deepEqual(store.getActions(), expected, `Didn't return the expected actions`)
    }
  })
})
