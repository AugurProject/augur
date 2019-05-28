import {
  BULK_MARKET_TRADING_HISTORY,
  UPDATE_MARKET_TRADING_HISTORY
} from "modules/markets/actions/market-trading-history-management";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { BaseAction } from "modules/types";
import { MarketTradingHistory } from "modules/types";

const DEFAULT_STATE: MarketTradingHistory = {};

export default function(
  tradingHistory: MarketTradingHistory = DEFAULT_STATE,
  { type, data }: BaseAction
) {
  switch (type) {
    case UPDATE_MARKET_TRADING_HISTORY:
      return {
        ...tradingHistory,
        [data.marketId]: data.marketTradingHistory
      };
    case BULK_MARKET_TRADING_HISTORY:
      return {
        ...tradingHistory,
        ...data.keyedMarketTradingHistory
      };
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return tradingHistory;
  }
}
