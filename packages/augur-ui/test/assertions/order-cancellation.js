

export default function (orderCancellation) {
  describe('orderCancellation', () => {
    it('orderCancellation', () => {
      assert.isObject(orderCancellation)
    })

    it('orderCancellation.cancelOrder', () => {
      assert.isFunction(orderCancellation.cancelOrder)
    })

    it('orderCancellation.abortCancelOrderConfirmation', () => {
      assert.isFunction(orderCancellation.abortCancelOrderConfirmation)
    })

    it('orderCancellation.showCancelOrderConfirmation', () => {
      assert.isFunction(orderCancellation.showCancelOrderConfirmation)
    })

    it('orderCancellation.cancellationStatuses', () => {
      assert.isObject(orderCancellation.cancellationStatuses)
      assert.deepEqual(orderCancellation.cancellationStatuses, {
        CANCELLATION_CONFIRMATION: 'CANCELLATION_CONFIRMATION',
        CANCELLING: 'CANCELLING',
        CANCELLED: 'CANCELLED',
        CANCELLATION_FAILED: 'CANCELLATION_FAILED',
      })
    })
  })
}
