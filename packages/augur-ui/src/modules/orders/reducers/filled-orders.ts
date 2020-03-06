import { UPDATE_USER_FILLED_ORDERS } from 'modules/markets/actions/market-trading-history-management';
import { FilledOrders, BaseAction } from 'modules/types';

const DEFAULT_STATE: FilledOrders = {};

export default function(
  filledOrders: FilledOrders = DEFAULT_STATE,
  { type, data }: BaseAction
): FilledOrders {
  switch (type) {
    case UPDATE_USER_FILLED_ORDERS: {
      const { userFilledOrders, account } = data;

      return {
        ...filledOrders,
        [account]: {
          ...userFilledOrders,
        },
      };
    }
    default:
      return filledOrders;
  }
}
