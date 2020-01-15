import { REFRESH_USER_OPEN_ORDERS } from 'modules/markets/actions/market-trading-history-management';
import { BaseAction, OpenOrders } from 'modules/types';
import { CLEAR_LOGIN_ACCOUNT } from 'modules/account/actions/login-account';
import { RESET_STATE } from 'modules/app/actions/reset-state';

const DEFAULT_STATE: OpenOrders = {};

export default function(
  userOpenOrders: OpenOrders = DEFAULT_STATE,
  { type, data }: BaseAction
): OpenOrders {
  switch (type) {
    case REFRESH_USER_OPEN_ORDERS: {
      const { openOrders } = data;

      return {
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
