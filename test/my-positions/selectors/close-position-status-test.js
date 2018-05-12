import sinon from 'sinon'
import { selectClosePositionStatus, __RewireAPI__ as ReWireModule } from 'modules/my-positions/selectors/close-position-status'

import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_NO_ORDERS, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/close-dialog-status'
import { SUCCESS, FAILED } from 'modules/transactions/constants/statuses'

describe('modules/my-positions/selectors/close-position-status', function () { // eslint-disable-line func-names, prefer-arrow-callback
  const test = (t) => {
    it(t.description, () => {
      const delayClearTradeGroupIds = sinon.stub()
      ReWireModule.__Rewire__('delayClearTradeGroupIds', delayClearTradeGroupIds)

      const result = selectClosePositionStatus({ closePositionTradeGroups: t.state.closePositionTradeGroups, transactionsData: t.state.transactionsData })
      t.assertions(result, delayClearTradeGroupIds.calledOnce)

      ReWireModule.__ResetDependency__('delayClearTradeGroupIds')
    })
  }

  test({
    description: 'should return CLOSE_DIALOG_CLi523OSING status if closePositionTradeGroups has a tradeGroupId and transactionsData does not house a corresponding tradeGroupId',
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: 'CLOSE_DIALOG_CLOSING',
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
      assert.isTrue(clearTradeCalled, `Didn't call delay clear trade group ids`)
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_CLOSING,
        },
      }
      assert.deepEqual(res, expected, `Didn't return the expected object`)
      assert.isTrue(clearTradeCalled, `Didn't call delay clear trade group ids`)
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
      assert.isTrue(clearTradeCalled, `Didn't call delay clear trade group ids`)
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_SUCCESS,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
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
    assertions: (res, clearTradeCalled) => {
      const expected = {
        '0xMarketID1': {
          0: CLOSE_DIALOG_NO_ORDERS,
        },
      }

      assert.deepEqual(res, expected, `Didn't return the expected object`)
    },
  })
})
