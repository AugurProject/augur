

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
