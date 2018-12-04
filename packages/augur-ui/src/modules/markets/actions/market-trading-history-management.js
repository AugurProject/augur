import { augur } from "services/augurjs";
import logError from "utils/log-error";

export const UPDATE_MARKET_TRADING_HISTORY = "UPDATE_MARKET_TRADING_HISTORY";

export function updateMarketTradingHistory(marketId, tradingHistory) {
  return {
    type: UPDATE_MARKET_TRADING_HISTORY,
    data: {
      marketId,
      tradingHistory
    }
  };
}

export const loadMarketTradingHistory = (options, callback = logError) => (
  dispatch,
  getState
) => {
  if (options === null || !options.marketId) return callback(null);
  const allOptions = Object.assign(
    { sortBy: "timestamp", isSortDescending: true },
    options
  );
  augur.augurNode.submitRequest(
    "getTradingHistory",
    {
      ...allOptions
    },
    (err, tradingHistory) => {
      if (err) return callback(err);
      if (tradingHistory == null) return callback(null);
      dispatch(updateMarketTradingHistory(options.marketId, tradingHistory));
      callback(null, tradingHistory);
    }
  );
};
