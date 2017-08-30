import { describe, it, beforeEach } from 'mocha'
import { assert } from 'chai'
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe('modules/my-positions/actions/load-account-trades.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    CLEAR_ACCOUNT_TRADES: 'CLEAR_ACCOUNT_TRADES',
    SELL_COMPLETE_SETS: 'SELL_COMPLETE_SETS',
    UPDATE_ACCOUNT_TRADES_DATA: 'UPDATE_ACCOUNT_TRADES_DATA',
    CONVERT_LOGS_TO_TRANSACTIONS: 'CONVERT_LOGS_TO_TRANSACTIONS',
    UPDATE_COMPLETE_SETS_BOUGHT: 'UPDATE_COMPLETE_SETS_BOUGHT'
  }

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})
    t.assertions(store)
  })

  describe('loadAccountTrades', () => {
    const { loadAccountTrades, __RewireAPI__ } = require('modules/my-positions/actions/load-account-trades')

    const mockAugur = {
      logs: {
        getAccountTrades: () => {},
        getLogsChunked: () => {},
        getBuyCompleteSetsLogs: () => {},
        parseCompleteSetsLogs: sinon.stub().returns(true)
      }
    }
    sinon.stub(mockAugur.logs, 'getAccountTrades', (filter, cb) => {
      cb(null, [])
    })
    sinon.stub(mockAugur.logs, 'getLogsChunked', (filter, cb) => {
      cb(['test'])
    })
    sinon.stub(mockAugur.logs, 'getBuyCompleteSetsLogs', (filter, cb) => {
      cb(null, {})
    })

    __RewireAPI__.__Rewire__('clearAccountTrades', () => ({
      type: MOCK_ACTION_TYPES.CLEAR_ACCOUNT_TRADES
    }))
    __RewireAPI__.__Rewire__('augur', mockAugur)
    __RewireAPI__.__Rewire__('sellCompleteSets', market => ({
      type: MOCK_ACTION_TYPES.SELL_COMPLETE_SETS,
      data: {
        market
      }
    }))
    __RewireAPI__.__Rewire__('updateAccountTradesData', (trades, market) => ({
      type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA,
      data: {
        trades,
        market
      }
    }))
    __RewireAPI__.__Rewire__('convertLogsToTransactions', (type, payouts) => ({
      type: MOCK_ACTION_TYPES.CONVERT_LOGS_TO_TRANSACTIONS,
      data: {
        type,
        payouts
      }
    }))
    __RewireAPI__.__Rewire__('updateCompleteSetsBought', (parsedCompleteSetsLogs, market) => ({
      type: MOCK_ACTION_TYPES.UPDATE_COMPLETE_SETS_BOUGHT,
      data: {
        parsedCompleteSetsLogs,
        market
      }
    }))

    beforeEach(() => {
      mockAugur.logs.getAccountTrades.reset()
      mockAugur.logs.getLogsChunked.reset()
      mockAugur.logs.getBuyCompleteSetsLogs.reset()
      mockAugur.logs.parseCompleteSetsLogs.reset()
    })

    test({
      description: `should call callback if no account present`,
      state: {
        loginAccount: {}
      },
      assertions: (store) => {
        const callback = sinon.stub()

        store.dispatch(loadAccountTrades({}, callback))

        assert.isTrue(callback.calledOnce)
      }
    })

    test({
      description: `should dispatch the expected actions WITHOUT market param`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        }
      },
      assertions: (store) => {
        store.dispatch(loadAccountTrades({}, () => {}))

        const actualActions = store.getActions()

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.CLEAR_ACCOUNT_TRADES
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA,
            data: {
              trades: [],
              market: undefined
            }
          },
          {
            type: MOCK_ACTION_TYPES.CONVERT_LOGS_TO_TRANSACTIONS,
            data: {
              type: 'payout',
              payouts: ['test']
            }
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_COMPLETE_SETS_BOUGHT,
            data: {
              parsedCompleteSetsLogs: true,
              market: undefined
            }
          }
        ]

        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected actions`)
        assert.isTrue(mockAugur.logs.getAccountTrades.calledOnce, `Didn't call 'getAccountTrades' once as expected`)
        assert.isTrue(mockAugur.logs.getLogsChunked.calledOnce, `Didn't call 'getLogsChunked' once as expected`)
        assert.isTrue(mockAugur.logs.getBuyCompleteSetsLogs.calledOnce, `Didn't call 'getBuyCompleteSetsLogs' once as expected`)
        assert.isTrue(mockAugur.logs.parseCompleteSetsLogs.calledOnce, `Didn't call 'parseCompleteSetsLogs' once as expected`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market param`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        }
      },
      assertions: (store) => {
        store.dispatch(loadAccountTrades({ market: '0xMARKETID' }, () => {}))

        const actualActions = store.getActions()

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_ACCOUNT_TRADES_DATA,
            data: {
              trades: [],
              market: '0xMARKETID'
            }
          },
          {
            type: MOCK_ACTION_TYPES.CONVERT_LOGS_TO_TRANSACTIONS,
            data: {
              type: 'payout',
              payouts: ['test']
            }
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_COMPLETE_SETS_BOUGHT,
            data: {
              parsedCompleteSetsLogs: true,
              market: '0xMARKETID'
            }
          }
        ]

        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected actions`)
        assert.isTrue(mockAugur.logs.getAccountTrades.calledOnce, `Didn't call 'getAccountTrades' once as expected`)
        assert.isTrue(mockAugur.logs.getLogsChunked.calledOnce, `Didn't call 'getLogsChunked' once as expected`)
        assert.isTrue(mockAugur.logs.getBuyCompleteSetsLogs.calledOnce, `Didn't call 'getBuyCompleteSetsLogs' once as expected`)
        assert.isTrue(mockAugur.logs.parseCompleteSetsLogs.calledOnce, `Didn't call 'parseCompleteSetsLogs' once as expected`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market param AND err returned`,
      state: {
        loginAccount: {
          address: '0xUSERADDRESS',
          registerBlockNumber: 123
        }
      },
      assertions: (store) => {
        const callback = sinon.stub()

        mockAugur.logs.getAccountTrades.restore()

        sinon.stub(mockAugur.logs, 'getAccountTrades', (filter, cb) => {
          cb(true)
        })

        store.dispatch(loadAccountTrades({ market: '0xMARKETID' }, callback))

        const actualActions = store.getActions()

        const expectedActions = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_LOGS_TO_TRANSACTIONS,
            data: {
              type: 'payout',
              payouts: ['test']
            }
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_COMPLETE_SETS_BOUGHT,
            data: {
              parsedCompleteSetsLogs: true,
              market: '0xMARKETID'
            }
          }
        ]

        assert.deepEqual(actualActions, expectedActions, `Didn't dispatch the expected actions`)
        assert.isTrue(mockAugur.logs.getAccountTrades.calledOnce, `Didn't call 'getAccountTrades' once as expected`)
        assert.isTrue(mockAugur.logs.getLogsChunked.calledOnce, `Didn't call 'getLogsChunked' once as expected`)
        assert.isTrue(mockAugur.logs.getBuyCompleteSetsLogs.calledOnce, `Didn't call 'getBuyCompleteSetsLogs' once as expected`)
        assert.isTrue(mockAugur.logs.parseCompleteSetsLogs.calledOnce, `Didn't call 'parseCompleteSetsLogs' once as expected`)
        assert.isTrue(callback.calledOnce, `Didn't call the callback once as expected`)
      }
    })
  })
})
