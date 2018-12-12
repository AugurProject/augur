import mocks from "test/mockStore";
import { CANCEL_ORDER, BID, ASK } from "modules/transactions/constants/types";
import { augur } from "services/augurjs";

jest.mock("services/augurjs");

describe("modules/orders/actions/cancel-order.js", () => {
  augur.api = jest.fn(() => {});
  augur.api.CancelOrder = jest.fn(() => {});
  augur.api.CancelOrder.cancelOrder = jest.fn(() => {});

  const { mockStore, state } = mocks;
  const cancelOrderModule = require("modules/orders/actions/cancel-order");

  const store = mockStore({
    ...state,
    transactionsData: {
      cancelTxn: {
        type: CANCEL_ORDER,
        data: {
          order: {
            id:
              "0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3",
            type: BID
          },
          market: { id: "testMarketId" },
          outcome: {}
        }
      }
    }
  });

  afterEach(() => {
    store.clearActions();
  });

  describe("cancelOrder", () => {
    test(`shouldn't dispatch if order doesn't exist`, () => {
      store.dispatch(
        cancelOrderModule.cancelOrder("nonExistingOrderId", "testMarketId", BID)
      );
      store.dispatch(
        cancelOrderModule.cancelOrder(
          "0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3",
          "nonExistingMarketId",
          BID
        )
      );
      store.dispatch(
        cancelOrderModule.cancelOrder(
          "0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3",
          "testMarketId",
          ASK
        )
      );

      expect(store.getActions()).toEqual([]);
    });
  });
});
