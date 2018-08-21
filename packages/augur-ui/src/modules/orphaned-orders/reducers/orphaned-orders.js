import {
  ADD_ORPHANED_ORDER,
  DISMISS_ORPHANED_ORDER,
  REMOVE_ORPHANED_ORDER,
  CLEAR_ORPHANED_ORDER_DATA
} from "src/modules/orphaned-orders/actions";
import { RESET_STATE } from "src/modules/app/actions/reset-state";

const DEFAULT_STATE = [];

export default function(state = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case ADD_ORPHANED_ORDER:
      if (state.findIndex(it => it.orderId === data.orderId) !== -1)
        return state;
      return [
        ...state,
        {
          dismissed: false,
          ...data
        }
      ];
    case DISMISS_ORPHANED_ORDER:
      return state.map(it => {
        if (it.orderId !== data) return it;
        return {
          ...it,
          dismissed: true
        };
      });

    case REMOVE_ORPHANED_ORDER:
      return state.filter(it => it.orderId !== data);

    case CLEAR_ORPHANED_ORDER_DATA:
      return DEFAULT_STATE;

    case RESET_STATE:
      return DEFAULT_STATE;

    default:
      return state;
  }
}
