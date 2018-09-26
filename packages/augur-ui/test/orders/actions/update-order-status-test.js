import { describe, it, afterEach } from "mocha";

import proxyquire from "proxyquire";
import mocks from "test/mockStore";
import { CLOSE_DIALOG_CLOSING } from "modules/markets/constants/close-dialog-status";
import { BUY } from "modules/transactions/constants/types";
import { updateOrderStatus } from "modules/orders/actions/update-order-status";

describe("modules/orders/actions/update-order-status.js", () => {
  proxyquire.noPreserveCache();
  const store = mocks.mockStore(mocks.state);
  afterEach(() => {
    store.clearActions();
  });
  describe("updateOrderStatus", () => {
    it(`shouldn't dispatch if order cannot be found`, () => {
      store.dispatch(
        updateOrderStatus({
          orderId: "nonExistingOrderId",
          status: CLOSE_DIALOG_CLOSING,
          marketId: "marketId",
          outcome: 2,
          orderTypeLabel: BUY
        })
      );
      assert.lengthOf(store.getActions(), 0);
      store.dispatch(
        updateOrderStatus({
          orderId: "orderId",
          status: CLOSE_DIALOG_CLOSING,
          marketId: "nonExistingMarketId",
          outcome: 2,
          orderTypeLabel: BUY
        })
      );
      assert.lengthOf(store.getActions(), 0);
    });
    it(`should dispatch action`, () => {
      store.dispatch(
        updateOrderStatus({
          orderId:
            "0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3",
          status: CLOSE_DIALOG_CLOSING,
          marketId: "testMarketId",
          outcome: 2,
          orderTypeLabel: BUY
        })
      );
      assert.deepEqual(store.getActions(), [
        {
          type: "UPDATE_ORDER_STATUS",
          data: {
            orderId:
              "0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3",
            status: CLOSE_DIALOG_CLOSING,
            marketId: "testMarketId",
            orderType: BUY
          }
        }
      ]);
    });
  });
});
