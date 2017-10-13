import { UPDATE_ORDER_STATUS } from 'modules/bids-asks/actions/update-order-status'

/**
 * @param {Object} orderCancellation
 * @param {Object} action
 */
export default function (orderCancellation = {}, action) {
  switch (action.type) {
    case UPDATE_ORDER_STATUS:
      return {
        ...orderCancellation,
        [action.orderID]: action.status
      }
    default:
      return orderCancellation
  }
}
