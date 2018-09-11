import proxyquire from "proxyquire";
import mocks from "test/mockStore";

describe("modules/orders/selectors/order-cancellation.js", () => {
  proxyquire.noPreserveCache().noCallThru();

  const { store } = mocks;
  const orderCancellationSelector = proxyquire(
    "../../../src/modules/orders/selectors/order-cancellation",
    {
      "../../../store": store
    }
  ).default;

  it("should select correct values", () => {
    const orderCancellation = orderCancellationSelector();
    assert.isFunction(orderCancellation.cancelOrder);
    assert.propertyVal(orderCancellation, "an orderId", "a status");
    assert.lengthOf(Object.keys(orderCancellation), 2);
  });
});
