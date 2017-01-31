import { describe, it } from 'mocha';
import { assert } from 'chai';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import proxyquire from 'proxyquire';
import sinon from 'sinon';

import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED, CLOSE_DIALOG_PARTIALLY_FAILED, CLOSE_DIALOG_SUCCESS } from 'modules/market/constants/close-dialog-status';

describe('modules/my-positions/selectors/close-position-status', () => {
  proxyquire.noPreserveCache().noCallThru();

  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state);
      console.log('store -- ', store.getState());

      const mockClearClosePositionOutcome = () => {};

      const selector = proxyquire('../../../src/modules/my-positions/selectors/close-position-status', {
        '../../../store': store,
        '../../my-positions/actions/clear-close-position-outcome': mockClearClosePositionOutcome
      });

      t.assertions(selector.default());
    });
  };

  test({
    description: 'should have correct status if closePositionTradeGroups has a tradeGroupID and transactionsData does not house a corresponding tradeGroupID',
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
});
