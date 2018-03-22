

import proxyquire from 'proxyquire'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  UPDATE_ACCOUNT_POSITIONS_DATA,
  updateAccountPositionsData,
} from 'modules/my-positions/actions/update-account-trades-data'

describe('modules/my-positions/actions/update-account-trades-data.js', () => {
  proxyquire.noPreserveCache().noCallThru()

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    UPDATE_TRANSACTIONS_DATA: 'UPDATE_TRANSACTIONS_DATA',
    UPDATE_ORDERS: 'UPDATE_ORDERS',
    LOAD_BIDS_ASKS_HISTORY: 'LOAD_BIDS_ASKS_HISTORY',
  }
  const mockAddTradeTransactions = {
    addTradeTransactions: (data) => { },
  }
  mockAddTradeTransactions.addTradeTransactions = sinon.stub().returns({ type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_DATA })
  const mockloadAccountPositions = {
    loadAccountPositions: () => { },
  }
  mockloadAccountPositions.loadAccountPositions = sinon.stub().returns({ type: 'LOAD_ACCOUNT_POSITIONS' })
  const mockConvertTradeLogsToTransactions = {
    convertTradeLogsToTransactions: () => { },
  }
  sinon.stub(mockConvertTradeLogsToTransactions, 'convertTradeLogsToTransactions').callsFake((logType, data, marketId) => ({
    type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_DATA,
    logType,
    data,
    marketId,
  }))
  const mockUpdateOrders = {
    updateOrders: () => { },
  }
  sinon.stub(mockUpdateOrders, 'updateOrders').callsFake((data, isAddition) => ({
    type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
    data,
    isAddition,
  }))

  const mockLoadBidsAsksHistory = {
    loadAccountOrders: () => { },
  }
  sinon.stub(mockLoadBidsAsksHistory, 'loadAccountOrders').callsFake(market => ({
    type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY,
    data: { ...market },
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
          address: '0xUSERID',
        },
        universe: {
          id: '0x12345',
        },
        env: {
          'augur-node': 'blah.com',
        },
      },
      assertions: (store) => {

        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders,
          '../../bids-asks/actions/load-open-orders': mockLoadBidsAsksHistory,
          './load-account-positions': mockloadAccountPositions,
        })

        store.dispatch(action.updateAccountBidsAsksData({ market: [{ '0xMARKETID': {} }] }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_DATA,
            logType: 'CreateOrder',
            data: {
              market: [
                {
                  '0xMARKETID': {},
                },
              ],
            },
            marketId: '0xMARKETID',
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
            data: {
              market: [
                {
                  '0xMARKETID': {},
                },
              ],
            },
            isAddition: true,
          },
          {
            type: 'LOAD_ACCOUNT_POSITIONS',
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action, getPositionInMarket`)
      },
    })

    test({
      description: `should dispatch the expected actions WITHOUT getPositionInMarket returning an error`,
      state: {
        loginAccount: {
          address: '0xUSERID',
        },
      },
      assertions: (store) => {
        const mockAugur = {
          augur: {
            api: {
              MarketFetcher: {
                getPositionInMarket: () => { },
              },
            },
          },
        }
        sinon.stub(mockAugur.augur.api.MarketFetcher, 'getPositionInMarket').callsFake(({ _account: account, _market: market }, callback) => callback({}))

        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders,
          '../../../services/augurjs': mockAugur,
          './load-account-positions': mockloadAccountPositions,
        })

        store.dispatch(action.updateAccountBidsAsksData({ '0xMARKETID': {} }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_DATA,
            logType: 'CreateOrder',
            data: {
              '0xMARKETID': {},
            },
            marketId: '0xMARKETID',
          },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
            data: {
              '0xMARKETID': {},
            },
            isAddition: true,
          },
          {
            type: 'LOAD_ACCOUNT_POSITIONS',
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action for getPositionInMarket`)
      },
    })
  })

  describe('updateAccountCancelsData', () => {
    test({
      description: `should return the expected action from cancel order`,
      assertions: (store) => {
        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders,
          './load-account-positions': mockloadAccountPositions,
          '../../bids-asks/actions/load-account-orders': mockLoadBidsAsksHistory,
        })

        store.dispatch(action.updateAccountCancelsData({ '0xMARKETID': {} }, '0xMARKETID'))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.UPDATE_TRANSACTIONS_DATA,
            logType: 'CancelOrder',
            data: {
              '0xMARKETID': {},
            },
            marketId: '0xMARKETID',
          },
          { type: MOCK_ACTION_TYPES.LOAD_BIDS_ASKS_HISTORY, data: {} },
          {
            type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
            data: {
              '0xMARKETID': {},
            },
            isAddition: false,
          },
        ]
        console.log(actual)
        assert.lengthOf(actual, 3)
        assert.deepEqual(actual, expected, `Didn't dispatch the expect action, cancel order`)
      },
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
              '0xMARKETID': {},
            },
            marketId: '0xMARKETID',
          },
        ]

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`)
      },
    })
  })
})
