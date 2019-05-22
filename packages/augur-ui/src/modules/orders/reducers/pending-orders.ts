import {
  ADD_PENDING_ORDER,
  REMOVE_PENDING_ORDER,
  LOAD_PENDING_ORDERS,
} from "modules/orders/actions/pending-orders-management";
import { PendingOrders, BaseAction, Order } from "modules/types";

const DEFAULT_STATE: PendingOrders = {};

export default function(
  pendingOrders: PendingOrders = DEFAULT_STATE,
  action: BaseAction,
) {
  switch (action.type) {
    case ADD_PENDING_ORDER: {
      const { pendingOrder, marketId } = action.data;
      const orders = pendingOrders[marketId] || [];
      if (pendingOrder) orders.push(pendingOrder);

      return {
        ...pendingOrders,
        [marketId]: orders,
      };
    }
    case REMOVE_PENDING_ORDER: {
      const { id, marketId } = action.data;
      let orders = pendingOrders[marketId] || [];
      orders = orders.filter((obj: Order) => obj.id !== id);
      if (orders.length > 0) {
        return {
          ...pendingOrders,
          [marketId]: orders,
        };
      }
      delete pendingOrders[marketId];
      return {
        ...pendingOrders,
      };
    }
    case LOAD_PENDING_ORDERS: {
      return action.data.pendingOrders;
    }
    default:
      return pendingOrders;
  }
}
