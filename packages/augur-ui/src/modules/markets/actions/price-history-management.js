import { augur } from "services/augurjs";
import logError from "utils/log-error";

export const UPDATE_MARKET_PRICE_HISTORY = "UPDATE_MARKET_PRICE_HISTORY";

export function updateMarketPriceHistory(marketId, priceHistory) {
  return {
    type: UPDATE_MARKET_PRICE_HISTORY,
    data: {
      marketId,
      priceHistory
    }
  };
}

export const loadPriceHistory = (options = {}, callback = logError) => (
  dispatch,
  getState
) => {
  augur.markets.getMarketPriceHistory(options, (err, priceHistory) => {
    if (err) return callback(err);
    if (priceHistory == null) return callback(null);
    dispatch(updateMarketPriceHistory(options.marketId, priceHistory));
    callback(null, priceHistory);
  });
};
