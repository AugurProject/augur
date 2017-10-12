import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  UPDATE_ACCOUNT_TRADES_DATA,
  UPDATE_ACCOUNT_POSITIONS_DATA,
  updateAccountPositionsData
} from 'modules/my-positions/actions/update-account-trades-data'

describe('modules/my-positions/actions/update-account-trades-data.js', () => {
  proxyquire.noPreserveCache().noCallThru()

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    CONVERT_TRADE_LOGS_TO_TRANSACTIONS: 'CONVERT_TRADE_LOGS_TO_TRANSACTIONS',
    UPDATE_ORDERS: 'UPDATE_ORDERS',
    LOAD_BIDS_ASKS_HISTORY: 'LOAD_BIDS_ASKS_HISTORY'
  }
  const mockloadAccountPositions = {
    loadAccountPositions: () => { }
  }
  mockloadAccountPositions.loadAccountPositions = sinon.stub().returns({ type: 'LOAD_ACCOUNT_POSITIONS' })
  const mockConvertTradeLogsToTransactions = {
    convertTradeLogsToTransactions: () => { }
  }
  sinon.stub(mockConvertTradeLogsToTransactions, 'convertTradeLogsToTransactions', (logType, data, marketID) => ({
    type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
    logType,
    data,
    marketID
  }))
  const mockUpdateOrders = {
    updateOrders: () => { }
  }
  sinon.stub(mockUpdateOrders, 'updateOrders', (data, isAddition) => ({
    type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
    data,
    isAddition
  }))

  const mockLoadBidsAsksHistory = {
    loadBidsAsksHistory: () => { }
  }
  sinon.stub(mockLoadBidsAsksHistory, 'loadBidsAsksHistory', market => ({
    type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY,
    data: { ...market }
  }))

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state || {})

      t.assertions(store)
    })
  }

  describe('updateAccountBidsAsksData', () => {
    test({
      description: `should dispatch the expected actions WITH updateAccountBidsAsksData returning an error`,
      state: {
        loginAccount: {
          address: '0xUSERID'
        },
        branch: {
          id: '0x12345'
        },
        env: {
          augurNodeUrl: 'blah.com'
        }
      },
      assertions: (store) => {

        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders,
          '../../bids-asks/actions/load-bids-asks-history': mockLoadBidsAsksHistory,
          './load-account-positions': mockloadAccountPositions
        })

        store.dispatch(action.updateAccountBidsAsksData({ market: [{ '0xMARKETID': {} }] }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
            logType: 'CreateOrder',
            data: {
              market: [
                {
                  '0xMARKETID': {}
                }
              ]
            },
            marketID: '0xMARKETID'
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
            data: {
              market: [
                {
                  '0xMARKETID': {}
                }
              ]
            },
            isAddition: true
          },
          {
            type: 'LOAD_ACCOUNT_POSITIONS'
          }
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action, getPositionInMarket`)
      }
    })

    test({
      description: `should dispatch the expected actions WITHOUT getPositionInMarket returning an error`,
      state: {
        loginAccount: {
          address: '0xUSERID'
        }
      },
      assertions: (store) => {
        const mockAugur = {
          augur: {
            api: {
              MarketFetcher: {
                getPositionInMarket: () => { }
              }
            }
          }
        }
        sinon.stub(mockAugur.augur.api.MarketFetcher, 'getPositionInMarket', ({ _account: account, _market: market }, callback) => callback({}))

        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders,
          '../../../services/augurjs': mockAugur,
          './load-account-positions': mockloadAccountPositions
        })

        store.dispatch(action.updateAccountBidsAsksData({ '0xMARKETID': {} }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
            logType: 'CreateOrder',
            data: {
              '0xMARKETID': {}
            },
            marketID: '0xMARKETID'
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
            data: {
              '0xMARKETID': {}
            },
            isAddition: true
          },
          {
            type: 'LOAD_ACCOUNT_POSITIONS'
          }
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action for getPositionInMarket`)
      }
    })
  })

  describe('updateAccountCancelsData', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders,
          './load-account-positions': mockloadAccountPositions
        })

        store.dispatch(action.updateAccountCancelsData({ '0xMARKETID': {} }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
            logType: 'CancelOrder',
            data: {
              '0xMARKETID': {}
            },
            marketID: '0xMARKETID'
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
            data: {
              '0xMARKETID': {}
            },
            isAddition: false
          }
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`)
      }
    })
  })

  describe('updateAccountTradesData', () => {
    test({
      description: `should return the expected actions WITH updateAccountTradesData returning an error`,
      state: {
        loginAccount: {
          address: '0xUSERID'
        }
      },
      assertions: (store) => {

        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../bids-asks/actions/load-bids-asks-history': mockLoadBidsAsksHistory,
          './load-account-positions': mockloadAccountPositions
        })

        store.dispatch(action.updateAccountTradesData({ '0xMARKETID': {} }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
            logType: 'FillOrder',
            data: {
              '0xMARKETID': {}
            },
            marketID: '0xMARKETID'
          },
          {
            data: undefined,
            market: {},
            type: UPDATE_ACCOUNT_TRADES_DATA
          },
          {
            type: 'LOAD_ACCOUNT_POSITIONS'
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY,
            data: {
              market: {}
            }
          }
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`)
      }
    })

    test({
      description: `should return the expected actions WITH getPositionInMarket returning NO error`,
      state: {
        loginAccount: {
          address: '0xUSERID'
        }
      },
      assertions: (store) => {

        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../bids-asks/actions/load-bids-asks-history': mockLoadBidsAsksHistory,
          './load-account-positions': mockloadAccountPositions
        })

        store.dispatch(action.updateAccountTradesData({ '0xMARKETID': { type: 'something' } }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
            logType: 'FillOrder',
            data: {
              '0xMARKETID': {
                type: 'something'
              }
            },
            marketID: '0xMARKETID'
          },
          {
            data: undefined,
            type: UPDATE_ACCOUNT_TRADES_DATA,
            market: {
              type: 'something'
            }
          },
          {
            type: 'LOAD_ACCOUNT_POSITIONS'
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY,
            data: {
              market: {
                type: 'something'
              }
            }
          }
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`)
      }
    })
  })

  describe('updateAccountPositionsData', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        store.dispatch(updateAccountPositionsData({ '0xMARKETID': {} }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: UPDATE_ACCOUNT_POSITIONS_DATA,
            data: {
              '0xMARKETID': {}
            },
            marketID: '0xMARKETID'
          }
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`)
      }
    })
  })
})
