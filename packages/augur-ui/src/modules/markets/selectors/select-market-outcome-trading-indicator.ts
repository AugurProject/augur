import { DOWN, UP, NONE, BUY } from "modules/common-elements/constants";
import { createBigNumber } from "utils/create-big-number";
import { orderBy, first } from "lodash";

export const selectMarketOutcomeTradingIndicator = (
  marketTradingHistory,
  outcome,
  getTradeType
) => {
  if (!outcome) return NONE;
  const { marketId } = outcome;
  return getTradeStatus(
    marketTradingHistory,
    marketId,
    outcome.id,
    getTradeType
  );
};

function getTradeStatus(
  marketTradingHistory,
  marketId,
  outcomeId,
  getTradeType
) {
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
  if (!getTradeType) {
    if (trades.length === 1) {
      return firstTrade.type === BUY ? UP : DOWN;
    }

    const secondTrade = sortedTrades[1];
    const isUp = createBigNumber(firstTrade.price).gt(
      createBigNumber(secondTrade.price)
    );

    return isUp ? UP : DOWN;
  }
  return firstTrade.type;
}
