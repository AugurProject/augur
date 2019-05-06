import {
  UPDATE_USER_TRADING_HISTORY,
  UPDATE_USER_MARKET_TRADING_HISTORY
} from "modules/markets/actions/market-trading-history-management";

const DEFAULT_STATE = () => ({});

export default function(filledOrders = DEFAULT_STATE(), { type, data }) {
  switch (type) {
    case UPDATE_USER_TRADING_HISTORY: {
      const { userFilledOrders, account } = data;

      return {
        [account]: userFilledOrders
      };
    }
    case UPDATE_USER_MARKET_TRADING_HISTORY: {
      const { userFilledOrders, account, marketId } = data;

      return {
        [account]: [
          ...filledOrders[account].filter(t => t.marketId !== marketId),
          ...userFilledOrders
        ]
      };
    }
    default:
      return filledOrders;
  }
}
