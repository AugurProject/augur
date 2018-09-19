import {
  UPDATE_ORDER_STATUS,
  UPDATE_ORDER_REMOVE
} from "modules/orders/actions/update-order-status";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};
/**
 * @param {Object} orderCancellation
 * @param {Object} action
 */
export default function(orderCancellation = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_ORDER_STATUS: {
      const { orderId, status } = data;
      return {
        ...orderCancellation,
        [orderId]: status
      };
    }
    case UPDATE_ORDER_REMOVE: {
      const { orderId } = data;
      delete orderCancellation[orderId];
      return {
        ...orderCancellation
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return orderCancellation;
  }
}
