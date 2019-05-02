import mocks from "test/mockStore";
import { CLOSE_DIALOG_CLOSING, BUY } from "modules/common-elements/constants";
import { updateOrderStatus } from "modules/orders/actions/update-order-status";

describe("modules/orders/actions/update-order-status.js", () => {
  describe("updateOrderStatus", () => {
    test(`shouldn't dispatch if order cannot be found`, () => {
      const store = mocks.mockStore(mocks.state);
      store.dispatch(
        updateOrderStatus({
          orderId: "nonExistingOrderId",
          status: CLOSE_DIALOG_CLOSING,
          marketId: "marketId",
          outcome: 2,
          orderTypeLabel: BUY
        })
      );
      expect(store.getActions()).toHaveLength(0);
    });

    test("should dispatch existing market id", () => {
      const store = mocks.mockStore(mocks.state);
      store.dispatch(
        updateOrderStatus({
          orderId: "orderId",
          status: CLOSE_DIALOG_CLOSING,
          marketId: "nonExistingMarketId",
          outcome: 2,
          orderTypeLabel: BUY
        })
      );
      expect(store.getActions()).toHaveLength(0);
    });

    test(`should dispatch action`, () => {
      const store = mocks.mockStore(mocks.state);
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
      expect(store.getActions()).toEqual([
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
