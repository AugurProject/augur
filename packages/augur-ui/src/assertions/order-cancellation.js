export default function(orderCancellation) {
  describe("orderCancellation", () => {
    test("orderCancellation", () => {
      expect(typeof orderCancellation).toBe("object");
    });

    test("orderCancellation.cancelOrder", () => {
      expect(typeof orderCancellation.cancelOrder).toBe("function");
    });

    test("orderCancellation.abortCancelOrderConfirmation", () => {
      expect(typeof orderCancellation.abortCancelOrderConfirmation).toBe("function");
    });

    test("orderCancellation.showCancelOrderConfirmation", () => {
      expect(typeof orderCancellation.showCancelOrderConfirmation).toBe("function");
    });

    test("orderCancellation.cancellationStatuses", () => {
      expect(typeof orderCancellation.cancellationStatuses).toBe("object");
      expect(orderCancellation.cancellationStatuses).toEqual({
        CANCELLATION_CONFIRMATION: "CANCELLATION_CONFIRMATION",
        CANCELLING: "CANCELLING",
        CANCELLED: "CANCELLED",
        CANCELLATION_FAILED: "CANCELLATION_FAILED"
      });
    });
  });
}
