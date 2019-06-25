import {
  BULK_MARKET_TRADING_HISTORY,
 } from "modules/markets/actions/market-trading-history-management";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { MarketTradingHistoryState, BaseAction } from "modules/types";

const DEFAULT_STATE: MarketTradingHistoryState = {};

export default function(
  tradingHistory: MarketTradingHistoryState = DEFAULT_STATE,
  { type, data }: BaseAction,
): MarketTradingHistoryState {
  switch (type) {
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
