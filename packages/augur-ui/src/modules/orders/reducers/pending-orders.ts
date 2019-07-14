import {
  ADD_PENDING_ORDER,
  REMOVE_PENDING_ORDER,
  LOAD_PENDING_ORDERS,
  UPDATE_PENDING_ORDER,
} from "modules/orders/actions/pending-orders-management";
import { PendingOrders, BaseAction, UIOrder } from "modules/types";

const DEFAULT_STATE: PendingOrders = {};

export default function(
  pendingOrders: PendingOrders = DEFAULT_STATE,
  { type, data }: BaseAction,
): PendingOrders {
  switch (type) {
    case ADD_PENDING_ORDER: {
      const { pendingOrder, marketId } = data;
      const orders = pendingOrders[marketId] || [];
      if (pendingOrder) orders.push(pendingOrder);

      return {
        ...pendingOrders,
        [marketId]: orders,
      };
    }
    case UPDATE_PENDING_ORDER: {
      const { id, marketId, status } = data;
      const orders = pendingOrders[marketId];
      if (!orders) return pendingOrders;
      const order = orders.find(o => o.id === id)
      if (!order) return pendingOrders;
      order.status = status;
      return pendingOrders;
    }
    case REMOVE_PENDING_ORDER: {
      const { id, marketId } = data;
      let orders = pendingOrders[marketId] || [];
      orders = orders.filter((obj: UIOrder) => obj.id !== id);
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
      return data.pendingOrders;
    }
    default:
      return pendingOrders;
  }
}
