import {
  ADD_PENDING_ORDER,
  REMOVE_PENDING_ORDER,
  UPDATE_PENDING_ORDER,
} from 'modules/orders/actions/pending-orders-management';
import { PendingOrders, BaseAction } from 'modules/types';
import { RESET_STATE } from 'modules/app/actions/reset-state';
import { CLEAR_LOGIN_ACCOUNT } from 'modules/account/actions/login-account';

const DEFAULT_STATE: PendingOrders = {};

export default function(
  pendingOrders: PendingOrders = DEFAULT_STATE,
  { type, data }: BaseAction
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
      const { id, marketId, status, hash, blockNumber } = data;
      const orders = pendingOrders[marketId];
      if (!orders) return pendingOrders;
      const order = orders.find(o => o.id === id);
      if (!order) return pendingOrders;
      order.status = status;
      order.hash = hash;
      order.blockNumber = blockNumber;
      return pendingOrders;
    }
    case REMOVE_PENDING_ORDER: {
      let orders = pendingOrders[data.marketId] || [];
      orders = orders.filter(obj => obj.id !== data.id);
      if (orders.length > 0) {
        return {
          ...pendingOrders,
          [data.marketId]: orders,
        };
      }
      delete pendingOrders[data.marketId];
      return {
        ...pendingOrders,
      };
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return pendingOrders;
  }
}
