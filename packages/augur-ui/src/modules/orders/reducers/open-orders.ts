import { UPDATE_USER_OPEN_ORDERS, UPDATE_USER_OPEN_ORDERS_MARKET } from 'modules/markets/actions/market-trading-history-management';
import { BaseAction, OpenOrders } from 'modules/types';
import { CLEAR_LOGIN_ACCOUNT } from 'modules/account/actions/login-account';
import { RESET_STATE } from 'modules/app/actions/reset-state';

const DEFAULT_STATE: OpenOrders = {};

export default function(
  userOpenOrders: OpenOrders = DEFAULT_STATE,
  { type, data }: BaseAction
): OpenOrders {
  switch (type) {
    case UPDATE_USER_OPEN_ORDERS: {
      const { openOrders } = data;

      return {
        ...userOpenOrders,
        ...openOrders,
      };
    }
    case UPDATE_USER_OPEN_ORDERS_MARKET: {
      const { marketId, openOrders } = data;
      const ordersNotInMarket = Object.keys(userOpenOrders).reduce(
        (p, m) => (m !== marketId ? { ...p, [m]: userOpenOrders[m] } : p),
        {}
      );
      return {
        ...ordersNotInMarket,
        ...openOrders,
      };
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE;
    default:
      return userOpenOrders;
  }
}
