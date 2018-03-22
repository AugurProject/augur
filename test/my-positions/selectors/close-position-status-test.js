

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'
import sinon from 'sinon'

import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_NO_ORDERS, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/close-dialog-status'
import { SUCCESS, FAILED } from 'modules/transactions/constants/statuses'
import { CLEAR_CLOSE_POSITION_OUTCOME } from 'modules/my-positions/actions/clear-close-position-outcome'

describe('modules/my-positions/selectors/close-position-status', function () { // eslint-disable-line func-names, prefer-arrow-callback
  proxyquire.noPreserveCache().noCallThru()

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  before(() => {
    this.clock = sinon.useFakeTimers()
  })

  after(() => {
    this.clock.restore()
  })

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state)

      const mockClearClosePositionOutcome = () => {}

      const selector = proxyquire('../../../src/modules/my-positions/selectors/close-position-status', {
        '../../../store': store,
        '../../my-positions/actions/clear-close-position-outcome': mockClearClosePositionOutcome,
      })

      t.assertions(selector.default(), store, this.clock)
    })
  }

  test({
    description: 'should return CLOSE_DIALOG_CLOSING status if closePositionTradeGroups has a tradeGroupId and transactionsData does not house a corresponding tradeGroupId',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1'],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
      },
    },
    assertions: (res) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_CLOSING,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
    },
  })

  test({
    description: 'should return CLOSE_DIALOG_CLOSING status if closePositionTradeGroups has a tradeGroupId and transactionsData also houses a corresponding tradeGroupId',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1'],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
        '0xTargetTransactionId': {
          tradeGroupId: '0x00000TradeGroupID1',
        },
      },
    },
    assertions: (res) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_CLOSING,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
    },
  })

  test({
    description: 'should return CLOSE_DIALOG_FAILED status if close fails prior to transaction execution',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: [CLOSE_DIALOG_FAILED],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
      },
    },
    assertions: (res, store, clock) => {
      let expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)

      clock.tick(3000)

      const actual = store.getActions()

      expected = [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketId: '0xMarketID1',
        outcomeId: '0',
      }]

      assert.deepEqual(actual, expected, `Didn't return the expected actions`)
    },
  })

  test({
    description: 'should return CLOSE_DIALOG_FAILED status if corresponding transactions fail',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1'],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
        '0xTargetTransactionID1': {
          tradeGroupId: '0x00000TradeGroupID1',
          status: FAILED,
        },
        '0xTargetTransactionID2': {
          tradeGroupId: '0x00000TradeGroupID1',
          status: FAILED,
        },
      },
    },
    assertions: (res, store, clock) => {
      let expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)

      clock.tick(3000)

      const actual = store.getActions()

      expected = [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketId: '0xMarketID1',
        outcomeId: '0',
      }]

      assert.deepEqual(actual, expected, `Didn't return the expected actions`)
    },
  })

  test({
    description: 'should return CLOSE_DIALOG_PARTIALLY_FAILED status if some corresponding transactions fail and all others succeed',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1'],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
        '0xTargetTransactionID1': {
          tradeGroupId: '0x00000TradeGroupID1',
          status: FAILED,
        },
        '0xTargetTransactionID2': {
          tradeGroupId: '0x00000TradeGroupID1',
          status: SUCCESS,
        },
      },
    },
    assertions: (res, store, clock) => {
      let expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)

      clock.tick(3000)

      const actual = store.getActions()

      expected = [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketId: '0xMarketID1',
        outcomeId: '0',
      }]

      assert.deepEqual(actual, expected, `Didn't return the expected actions`)
    },
  })

  test({
    description: 'should return CLOSE_DIALOG_PARTIALLY_FAILED and persist status if some corresponding transactions fail and others are still running',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1'],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
        '0xTargetTransactionID1': {
          tradeGroupId: '0x00000TradeGroupID1',
          status: FAILED,
        },
        '0xTargetTransactionID2': {
          tradeGroupId: '0x00000TradeGroupID1',
        },
      },
    },
    assertions: (res) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
    },
  })

  test({
    description: 'should return CLOSE_DIALOG_PARTIALLY_SUCCESS status if corresponding transactions succeed',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1'],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
        '0xTargetTransactionID1': {
          tradeGroupId: '0x00000TradeGroupID1',
          status: SUCCESS,
        },
        '0xTargetTransactionID2': {
          tradeGroupId: '0x00000TradeGroupID1',
          status: SUCCESS,
        },
      },
    },
    assertions: (res, store, clock) => {
      let expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_SUCCESS,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)

      clock.tick(3000)

      const actual = store.getActions()

      expected = [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketId: '0xMarketID1',
        outcomeId: '0',
      }]

      assert.deepEqual(actual, expected, `Didn't return the expected actions`)
    },
  })

  test({
    description: 'should return CLOSE_DIALOG_NO_ORDERS status if no orders are available to fulfill transaction execution',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: [CLOSE_DIALOG_NO_ORDERS],
        },
      },
      transactionsData: {
        '0xUnrelatedTransactionId': {
          tradeGroupId: '0x00000UnrelatedTradeGroupId',
        },
      },
    },
    assertions: (res, store, clock) => {
      let expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_NO_ORDERS,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)

      clock.tick(3000)

      const actual = store.getActions()

      expected = [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketId: '0xMarketID1',
        outcomeId: '0',
      }]

      assert.deepEqual(actual, expected, `Didn't return the expected actions`)
    },
  })
})
