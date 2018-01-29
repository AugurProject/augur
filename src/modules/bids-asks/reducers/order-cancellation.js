import { UPDATE_ORDER_STATUS } from 'modules/bids-asks/actions/update-order-status'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}
/**
 * @param {Object} orderCancellation
 * @param {Object} action
 */
export default function (orderCancellation = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ORDER_STATUS:
      return {
        ...orderCancellation,
        [action.orderID]: action.status
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return orderCancellation
  }
}
