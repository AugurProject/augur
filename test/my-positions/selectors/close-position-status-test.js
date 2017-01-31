import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';

import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/close-dialog-status';
import { SUCCESS, FAILED } from 'modules/transactions/constants/statuses';
import { CLEAR_CLOSE_POSITION_OUTCOME } from 'modules/my-positions/actions/clear-close-position-outcome';

describe('modules/my-positions/selectors/close-position-status', function () {
  this.timeout(5000);

  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, (done) => {
      const store = mockStore(t.state);

      const mockClearClosePositionOutcome = () => {};

      const selector = proxyquire('../../../src/modules/my-positions/selectors/close-position-status', {
        '../../../store': store,
        '../../my-positions/actions/clear-close-position-outcome': mockClearClosePositionOutcome
      });

      t.assertions(selector.default(), done, store);
    });
  };

  test({
    description: 'should return CLOSE_DIALOG_CLOSING status if closePositionTradeGroups has a tradeGroupID and transactionsData does not house a corresponding tradeGroupID',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1']
        }
      },
      transactionsData: {
        '0xUnrelatedTransactionID': {
          tradeGroupID: '0x00000UnrelatedTradeGroupID'
        }
      }
    },
    assertions: (res, done) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_CLOSING
        }
      });
      done();
    }
  });

  test({
    description: 'should return CLOSE_DIALOG_CLOSING status if closePositionTradeGroups has a tradeGroupID and transactionsData also houses a corresponding tradeGroupID',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1']
        }
      },
      transactionsData: {
        '0xUnrelatedTransactionID': {
          tradeGroupID: '0x00000UnrelatedTradeGroupID'
        },
        '0xTargetTransactionID': {
          tradeGroupID: '0x00000TradeGroupID1'
        }
      }
    },
    assertions: (res, done) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_CLOSING
        }
      });
      done();
    }
  });

  test({
    description: 'should return CLOSE_DIALOG_FAILED status if close fails prior to transaction execution',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: [CLOSE_DIALOG_FAILED]
        }
      },
      transactionsData: {
        '0xUnrelatedTransactionID': {
          tradeGroupID: '0x00000UnrelatedTradeGroupID'
        }
      }
    },
    assertions: (res, done, store) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED
        }
      });

      setTimeout(() => {
        assert.deepEqual(store.getActions(), [{
          type: CLEAR_CLOSE_POSITION_OUTCOME,
          marketID: '0xMarketID1',
          outcomeID: '0'
        }]);
        done();
      }, 3500);
    }
  });

  test({
    description: 'should return CLOSE_DIALOG_FAILED status if corresponding transactions fail',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1']
        }
      },
      transactionsData: {
        '0xUnrelatedTransactionID': {
          tradeGroupID: '0x00000UnrelatedTradeGroupID'
        },
        '0xTargetTransactionID1': {
          tradeGroupID: '0x00000TradeGroupID1',
          status: FAILED
        },
        '0xTargetTransactionID2': {
          tradeGroupID: '0x00000TradeGroupID1',
          status: FAILED
        }
      }
    },
    assertions: (res, done, store) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED
        }
      });

      setTimeout(() => {
        assert.deepEqual(store.getActions(), [{
          type: CLEAR_CLOSE_POSITION_OUTCOME,
          marketID: '0xMarketID1',
          outcomeID: '0'
        }]);
        done();
      }, 3500);
    }
  });

  test({
    description: 'should return CLOSE_DIALOG_PARTIALLY_FAILED status if some corresponding transactions fail and all others succeed',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1']
        }
      },
      transactionsData: {
        '0xUnrelatedTransactionID': {
          tradeGroupID: '0x00000UnrelatedTradeGroupID'
        },
        '0xTargetTransactionID1': {
          tradeGroupID: '0x00000TradeGroupID1',
          status: FAILED
        },
        '0xTargetTransactionID2': {
          tradeGroupID: '0x00000TradeGroupID1',
          status: SUCCESS
        }
      }
    },
    assertions: (res, done, store) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED
        }
      });

      setTimeout(() => {
        assert.deepEqual(store.getActions(), [{
          type: CLEAR_CLOSE_POSITION_OUTCOME,
          marketID: '0xMarketID1',
          outcomeID: '0'
        }]);
        done();
      }, 3500);
    }
  });

  test({
    description: 'should return CLOSE_DIALOG_PARTIALLY_FAILED and persist status if some corresponding transactions fail and others are still running',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1']
        }
      },
      transactionsData: {
        '0xUnrelatedTransactionID': {
          tradeGroupID: '0x00000UnrelatedTradeGroupID'
        },
        '0xTargetTransactionID1': {
          tradeGroupID: '0x00000TradeGroupID1',
          status: FAILED
        },
        '0xTargetTransactionID2': {
          tradeGroupID: '0x00000TradeGroupID1'
        }
      }
    },
    assertions: (res, done) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED
        }
      });
      done();
    }
  });

  test({
    description: 'should return CLOSE_DIALOG_PARTIALLY_SUCCESS status if corresponding transactions succeed',
    state: {
      closePositionTradeGroups: {
        '0xMarketID1': {
          0: ['0x00000TradeGroupID1']
        }
      },
      transactionsData: {
        '0xUnrelatedTransactionID': {
          tradeGroupID: '0x00000UnrelatedTradeGroupID'
        },
        '0xTargetTransactionID1': {
          tradeGroupID: '0x00000TradeGroupID1',
          status: SUCCESS
        },
        '0xTargetTransactionID2': {
          tradeGroupID: '0x00000TradeGroupID1',
          status: SUCCESS
        }
      }
    },
    assertions: (res, done, store) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_SUCCESS
        }
      });

      setTimeout(() => {
        assert.deepEqual(store.getActions(), [{
          type: CLEAR_CLOSE_POSITION_OUTCOME,
          marketID: '0xMarketID1',
          outcomeID: '0'
        }]);
        done();
      }, 3500);
    }
  });
});
