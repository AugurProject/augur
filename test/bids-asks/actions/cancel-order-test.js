import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import BigNumber from 'bignumber.js';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import mocks from 'test/mockStore';
import { CANCEL_ORDER, BUY, SELL } from 'modules/transactions/constants/types';

describe('modules/bids-asks/actions/cancel-order.js', () => {
  proxyquire.noPreserveCache().noCallThru();

  const { mockStore, actionCreator, state } = mocks;
  const augur = {
    cancel: sinon.stub(),
    rpc: { gasPrice: 1 },
    tx: { BuyAndSellShares: { cancel: {} } },
    getTxGasEth: sinon.stub()
  };
  const updateOrderStatus = actionCreator();
  const action = proxyquire('../../../src/modules/bids-asks/actions/cancel-order', {
    speedomatic: { bignum: sinon.stub().returns(new BigNumber('1', 10)) },
    '../../../services/augurjs': { augur },
    '../../bids-asks/actions/update-order-status': { updateOrderStatus }
  });

  const store = mockStore({
    ...state,
    transactionsData: {
      cancelTxn: {
        type: CANCEL_ORDER,
        data: {
          order: {
            id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
            type: BUY
          },
          market: { id: 'testMarketID' },
          outcome: {}
        }
      }
    }
  });

  afterEach(() => {
    augur.cancel.reset();
    updateOrderStatus.reset();
    store.clearActions();
  });

  describe('cancelOrder', () => {
    it(`shouldn't dispatch if order doesn't exist`, () => {
      store.dispatch(action.cancelOrder('nonExistingOrderID', 'testMarketID', 2, BUY));
      store.dispatch(action.cancelOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'nonExistingMarketID', 2, BUY));
      store.dispatch(action.cancelOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'testMarketID', 2, SELL));
      assert.deepEqual(store.getActions(), []);
    });
  });
});
