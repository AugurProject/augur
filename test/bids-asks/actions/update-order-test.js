import { describe, it, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import mocks from 'test/mockStore';
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status';
import { BUY } from 'modules/transactions/constants/types';
import { updateOrderStatus } from 'modules/bids-asks/actions/update-order-status';

describe('modules/bids-asks/actions/update-order-status.js', () => {
  proxyquire.noPreserveCache();
  const store = mocks.mockStore(mocks.state);
  afterEach(() => {
    store.clearActions();
  });
  describe('updateOrderStatus', () => {
    it(`shouldn't dispatch if order cannot be found`, () => {
      store.dispatch(updateOrderStatus('nonExistingOrderID', CLOSE_DIALOG_CLOSING, 'marketID', 2, BUY));
      assert.lengthOf(store.getActions(), 0);
      store.dispatch(updateOrderStatus('orderID', CLOSE_DIALOG_CLOSING, 'nonExistingMarketID', 2, BUY));
      assert.lengthOf(store.getActions(), 0);
    });
    it(`should dispatch action`, () => {
      store.dispatch(updateOrderStatus('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', CLOSE_DIALOG_CLOSING, 'testMarketID', 2, BUY));
      assert.deepEqual(store.getActions(), [{
        type: 'UPDATE_ORDER_STATUS',
        orderID: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
        status: CLOSE_DIALOG_CLOSING,
        marketID: 'testMarketID',
        orderType: BUY
      }]);
    });
  });
});
