import {
  BULK_MARKET_TRADING_HISTORY,
 } from "modules/markets/actions/market-trading-history-management";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { BaseAction } from "modules/types";
import type { Getters } from "@augurproject/sdk";

const DEFAULT_STATE: Getters.Trading.MarketTradingHistory = {};

export default function(
  tradingHistory: Getters.Trading.MarketTradingHistory = DEFAULT_STATE,
  { type, data }: BaseAction,
): Getters.Trading.MarketTradingHistory {
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
