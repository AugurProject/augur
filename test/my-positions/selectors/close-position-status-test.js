import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/close-dialog-status';
import { SUCCESS, FAILED } from 'modules/transactions/constants/statuses';
import { CLEAR_CLOSE_POSITION_OUTCOME } from 'modules/my-positions/actions/clear-close-position-outcome';

describe('modules/my-positions/selectors/close-position-status', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  before(() => {
    this.clock = sinon.useFakeTimers();
  });

  after(() => {
    this.clock.restore();
  });

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);

      const mockClearClosePositionOutcome = () => {};

      const selector = proxyquire('../../../src/modules/my-positions/selectors/close-position-status', {
        '../../../store': store,
        '../../my-positions/actions/clear-close-position-outcome': mockClearClosePositionOutcome
      });

      t.assertions(selector.default(), store, this.clock);
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
    assertions: (res) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_CLOSING
        }
      });
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
    assertions: (res) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_CLOSING
        }
      });
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
    assertions: (res, store, clock) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED
        }
      });

      clock.tick(3000);

      assert.deepEqual(store.getActions(), [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketID: '0xMarketID1',
        outcomeID: '0'
      }]);
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
    assertions: (res, store, clock) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_FAILED
        }
      });

      clock.tick(3000);

      assert.deepEqual(store.getActions(), [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketID: '0xMarketID1',
        outcomeID: '0'
      }]);
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
    assertions: (res, store, clock) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED
        }
      });

      clock.tick(3000);

      assert.deepEqual(store.getActions(), [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketID: '0xMarketID1',
        outcomeID: '0'
      }]);
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
    assertions: (res) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_PARTIALLY_FAILED
        }
      });
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
    assertions: (res, store, clock) => {
      assert.deepEqual(res, {
        '0xMarketID1': {
          0: CLOSE_DIALOG_SUCCESS
        }
      });

      clock.tick(3000);

      assert.deepEqual(store.getActions(), [{
        type: CLEAR_CLOSE_POSITION_OUTCOME,
        marketID: '0xMarketID1',
        outcomeID: '0'
      }]);
    }
  });
});
