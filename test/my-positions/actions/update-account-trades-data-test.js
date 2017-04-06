import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {
  updateSmallestPositions,
  updateSellCompleteSetsLock,
} from 'modules/my-positions/actions/update-account-trades-data';

export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS';
export const UPDATE_SELL_COMPLETE_SETS_LOCK = 'UPDATE_SELL_COMPLETE_SETS_LOCK';

describe('modules/my-positions/actions/update-account-trades-data.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const MOCK_ACTION_TYPES = {
    CONVERT_TRADE_LOGS_TO_TRANSACTIONS: 'CONVERT_TRADE_LOGS_TO_TRANSACTIONS',
    UPDATE_ORDERS: 'UPDATE_ORDERS'
  };

  const mockConvertTradeLogsToTransactions = {
    convertTradeLogsToTransactions: () => {}
  };
  sinon.stub(mockConvertTradeLogsToTransactions, 'convertTradeLogsToTransactions', (logType, data, marketID) => ({
    type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
    logType,
    data,
    marketID
  }));
  const mockUpdateOrders = {
    updateOrders: () => {}
  };
  sinon.stub(mockUpdateOrders, 'updateOrders', (data, isAddition) => ({
    type: MOCK_ACTION_TYPES.UPDATE_ORDERS,
    data,
    isAddition
  }));

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state || {});
      t.assertions(store);
    });
  };

  describe('updateSmallestPositions', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        store.dispatch(updateSmallestPositions('0xMARKETID', '0'));

        const actual = store.getActions();

        const expected = [
          {
            type: UPDATE_SMALLEST_POSITIONS,
            marketID: '0xMARKETID',
            smallestPosition: '0'
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`);
      }
    });
  });

  describe('updateSellCompleteSetsLock', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        store.dispatch(updateSellCompleteSetsLock('0xMARKETID', true));

        const actual = store.getActions();

        const expected = [
          {
            type: UPDATE_SELL_COMPLETE_SETS_LOCK,
            marketID: '0xMARKETID',
            isLocked: true
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`);
      }
    });
  });

  describe('updateAccountBidsAsksData', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders
        });

        store.dispatch(action.updateAccountBidsAsksData({ '0xMARKETID': {} }, '0xMARKETID'));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
            logType: 'log_add_tx',
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
          }
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`);
      }
    });
  });

  describe('updateAccountCancelsData', () => {
    test({
      description: `should return the expected action`,
      assertions: (store) => {
        const action = proxyquire('../../../src/modules/my-positions/actions/update-account-trades-data', {
          '../../transactions/actions/convert-logs-to-transactions': mockConvertTradeLogsToTransactions,
          '../../my-orders/actions/update-orders': mockUpdateOrders
        });

        store.dispatch(action.updateAccountCancelsData({ '0xMARKETID': {} }, '0xMARKETID'));

        const actual = store.getActions();

        const expected = [
          {
            type: MOCK_ACTION_TYPES.CONVERT_TRADE_LOGS_TO_TRANSACTIONS,
            logType: 'log_cancel',
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
        ];

        assert.deepEqual(actual, expected, `Didn't dispatch the expect action`);
      }
    });
  });
});
