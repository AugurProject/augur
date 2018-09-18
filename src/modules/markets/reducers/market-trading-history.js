import { UPDATE_MARKET_TRADING_HISTORY } from "modules/markets/actions/market-trading-history-management";
import { RESET_STATE } from "modules/app/actions/reset-state";

const DEFAULT_STATE = {};

export default function(tradingHistory = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKET_TRADING_HISTORY:
      return {
        ...tradingHistory,
        [action.data.marketId]: action.data.tradingHistory
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return tradingHistory;
  }
}
