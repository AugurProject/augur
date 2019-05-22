import {
  UPDATE_USER_TRADING_HISTORY,
  UPDATE_USER_MARKET_TRADING_HISTORY
} from "modules/markets/actions/market-trading-history-management";
import { FilledOrders, Order, BaseAction } from "modules/types";

const DEFAULT_STATE: FilledOrders = {};

export default function(filledOrders: FilledOrders = DEFAULT_STATE, { type, data }: BaseAction) {
  switch (type) {
    case UPDATE_USER_TRADING_HISTORY: {
      const { userFilledOrders, account } = data;

      return {
        [account]: userFilledOrders,
      };
    }
    case UPDATE_USER_MARKET_TRADING_HISTORY: {
      const { userFilledOrders, account, marketId } = data;

      return {
        [account]: [
          ...filledOrders[account].filter((t: Order) => t.marketId !== marketId),
          ...userFilledOrders,
        ],
      };
    }
    default:
      return filledOrders;
  }
}
