import {
  addOrphanedOrder,
  dismissOrphanedOrder,
  removeOrphanedOrder,
  cancelOrphanedOrder
} from "modules/orders/actions/orphaned-orders";
import { RESET_STATE } from "modules/app/actions/reset-state";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import { augur } from "services/augurjs";

jest.mock("services/augurjs");
jest.mock("src/select-state");
jest.mock("utils/log-error");

// I'm back door testing action creators here.
describe("modules/orders/reducers/orphaned-orders.js", () => {
  augur.api = jest.fn(() => {});
  augur.api.CancelOrder = jest.fn(() => {});
  augur.api.CancelOrder.cancelOrder = jest.fn(() => {});

  const OrphanedOrdersReducer = require("modules/orders/reducers/orphaned-orders")
    .default;

  describe("default state", () => {
    test("should be an empty array", () => {
      const actual = OrphanedOrdersReducer([], {});
      expect(actual).toEqual([]);
    });
  });

  describe("ADD_ORPHANED_ORDER", () => {
    test("should push the data payload onto the state with an added dismissed property", () => {
      const action = addOrphanedOrder({ orderId: "12345" });
      const actual = OrphanedOrdersReducer([], action);
      expect(actual).toEqual([
        {
          dismissed: false,
          orderId: "12345"
        }
      ]);
    });

    test("should do nothing if an order exists with the same orderId", () => {
      // I'm back door testing action creators here.
      const action = addOrphanedOrder({ orderId: "12345", timestamp: 123456 });
      const actual = OrphanedOrdersReducer(
        [
          {
            dismissed: false,
            orderId: "12345",
            timestamp: 123456
          }
        ],
        action
      );

      expect(actual).toEqual([
        {
          dismissed: false,
          orderId: "12345",
          timestamp: 123456
        }
      ]);
    });
  });

  describe("DISMISS_ORPHANED_ORDER", () => {
    test("should set dismissed propert to true", () => {
      const actual = OrphanedOrdersReducer(
        [
          {
            dismissed: false,
            orderId: "54321",
            timestamp: 123456
          },
          {
            dismissed: false,
            orderId: "12345",
            timestamp: 123456
          }
        ],
        dismissOrphanedOrder({ orderId: "12345" })
      );

      expect(actual).toEqual([
        {
          dismissed: false,
          orderId: "54321",
          timestamp: 123456
        },
        {
          dismissed: true,
          orderId: "12345",
          timestamp: 123456
        }
      ]);
    });
  });

  describe("REMOVE_ORPHANED_ORDER", () => {
    test("should filter out anything with a matching orderId", () => {
      const action = removeOrphanedOrder("12345");
      const actual = OrphanedOrdersReducer(
        [
          {
            dismissed: false,
            orderId: "12345"
          }
        ],
        action
      );

      expect(actual).toEqual([]);
    });
  });

  describe("RESET_STATE", () => {
    test("should return to the default state", () => {
      const actual = OrphanedOrdersReducer(
        [
          {
            dismissed: false,
            orderId: "12345"
          }
        ],
        {
          type: RESET_STATE
        }
      );

      expect(actual).toEqual([]);
    });
  });

  describe("CANCEL_ORDER", () => {
    test("should return to the default state", () => {
      const mockStore = configureMockStore([thunk]);
      const store = mockStore({
        blockchain: { currentAugurTimestamp: 1234 },
        loginAccount: { meta: {} }
      });
      store.dispatch(
        cancelOrphanedOrder({ orderId: "12345" }, actual => {
          expect(actual).toEqual([]);
        })
      );
    });
  });
});
