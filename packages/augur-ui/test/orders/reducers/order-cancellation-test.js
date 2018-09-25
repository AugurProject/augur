import orderCancellationReducer from "modules/orders/reducers/order-cancellation";
import { UPDATE_ORDER_STATUS } from "modules/orders/actions/update-order-status";

describe("modules/orders/reducers/order-cancellation.js", () => {
  it("should react to UPDATE_ORDER_STATUS action", () => {
    const currentState = {};

    const newState = orderCancellationReducer(currentState, {
      type: UPDATE_ORDER_STATUS,
      orderId: "an orderId",
      status: "a status"
    });

    assert.deepEqual(newState, { "an orderId": "a status" });
    assert.notStrictEqual(currentState, newState);
  });
});
