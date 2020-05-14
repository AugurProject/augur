import {
  ADD_PENDING_ORDER,
  REMOVE_PENDING_ORDER,
  UPDATE_PENDING_ORDER,
} from 'modules/orders/actions/pending-orders-management';
import { PendingOrdersType, BaseAction } from 'modules/types';
import { RESET_STATE } from 'modules/app/actions/reset-state';
import { APP_STATUS_ACTIONS } from 'modules/app/store/constants';
const { CLEAR_LOGIN_ACCOUNT } = APP_STATUS_ACTIONS;

const DEFAULT_STATE: PendingOrdersType = {};

export default function(
  pendingOrders: PendingOrdersType = DEFAULT_STATE,
  { type, data }: BaseAction
): PendingOrdersType {
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
