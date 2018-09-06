import {
  BUY_UP,
  BUY_DOWN,
  SELL_UP,
  SELL_DOWN,
  NONE,
  BUY
} from "modules/trades/constants/types";
import { createBigNumber } from "utils/create-big-number";
import { orderBy, first } from "lodash";

export const selectMarketOutcomeTradingIndicator = (
  marketTradingHistory,
  outcome
) => {
  if (!outcome) return NONE;
  const { marketId } = outcome;
  return getTradeStatus(marketTradingHistory, marketId, outcome.id);
};

function getTradeStatus(marketTradingHistory, marketId, outcomeId) {
  const marketHistory = marketTradingHistory[marketId];
  if (!marketHistory || marketHistory.length === 0) return NONE;

  const trades = marketHistory.filter(
    t => t.outcome === parseInt(outcomeId, 10)
  );
  if (!trades || trades.length === 0) return NONE;
  const sortedTrades = orderBy(
    trades,
    ["timestamp", "price"],
    ["desc", "desc"]
  );

  const firstTrade = first(sortedTrades);
  if (trades.length === 1) {
    return firstTrade.type === BUY ? BUY_UP : SELL_DOWN;
  }

  const secondTrade = sortedTrades[1];
  const isUp = createBigNumber(firstTrade.price).gt(
    createBigNumber(secondTrade.price)
  );
  if (isUp) {
    if (firstTrade.type === BUY) {
      return BUY_UP;
    }
    return SELL_UP;
  }

  if (firstTrade.type === BUY) {
    return BUY_DOWN;
  }
  return SELL_DOWN;
}
