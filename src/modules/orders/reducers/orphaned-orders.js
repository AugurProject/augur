import {
  ADD_ORPHANED_ORDER,
  DISMISS_ORPHANED_ORDER,
  REMOVE_ORPHANED_ORDER,
  CLEAR_ORPHANED_ORDER_DATA
} from "modules/orders/actions/orphaned-orders";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = [];

export default function(state = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case ADD_ORPHANED_ORDER: {
      const { order } = data;
      if (state.findIndex(it => it.orderId === order.orderId) !== -1)
        return state;
      return [
        ...state,
        {
          dismissed: false,
          ...order
        }
      ];
    }
    case DISMISS_ORPHANED_ORDER: {
      const { orderId } = data;
      return state.map(it => {
        if (it.orderId !== orderId) return it;
        return {
          ...it,
          dismissed: true
        };
      });
    }
    case REMOVE_ORPHANED_ORDER: {
      const { orderId } = data;
      return state.filter(it => it.orderId !== orderId);
    }
    case CLEAR_ORPHANED_ORDER_DATA:
      return DEFAULT_STATE;

    case RESET_STATE:
      return DEFAULT_STATE;

    default:
      return state;
  }
}
