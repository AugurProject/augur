import {
  BULK_MARKET_TRADING_HISTORY,
  UPDATE_MARKET_TRADING_HISTORY
} from "modules/markets/actions/market-trading-history-management";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { BaseAction } from "src/modules/types";
import { MarketTradingHistory } from "src/modules/types";

const DEFAULT_STATE: MarketTradingHistory = {};

export default function(
  tradingHistory: MarketTradingHistory = DEFAULT_STATE,
  action: BaseAction
) {
  switch (action.type) {
    case UPDATE_MARKET_TRADING_HISTORY:
      return {
        ...tradingHistory,
        [action.data.marketId]: action.data.marketTradingHistory
      };
    case BULK_MARKET_TRADING_HISTORY:
      return {
        ...tradingHistory,
        ...action.data.keyedMarketTradingHistory
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return tradingHistory;
  }
}
