import { UPDATE_ORDER_STATUS } from "modules/orders/actions/update-order-status";

describe("modules/orders/reducers/order-cancellation.js", () => {
  const orderCancellationReducer = require("modules/orders/reducers/order-cancellation")
    .default;

  test("should react to UPDATE_ORDER_STATUS action", () => {
    const currentState = {};

    const newState = orderCancellationReducer(currentState, {
      type: UPDATE_ORDER_STATUS,
      data: {
        orderId: "an orderId",
        status: "a status"
      }
    });

    expect(newState).toEqual({ "an orderId": "a status" });
  });
});
