import { UPDATE_USER_TRADING_HISTORY } from "modules/markets/actions/market-trading-history-management";

const DEFAULT_STATE = () => ({});

export default function(filledOrders = DEFAULT_STATE(), { type, data }) {
  switch (type) {
    case UPDATE_USER_TRADING_HISTORY: {
      const { userFilledOrders, account } = data;

      return {
        [account]: userFilledOrders
      };
    }
    default:
      return filledOrders;
  }
}
