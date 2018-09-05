import { loadMarketsInfo } from "modules/markets/actions/load-markets-info";
import { isMarketLoaded } from "modules/markets/helpers/is-market-loaded";
import { loadMarketTradingHistory } from "modules/markets/actions/load-market-trading-history";
import logError from "utils/log-error";

export const loadMarketsInfoIfNotLoaded = (marketIds, callback = logError) => (
  dispatch,
  getState
) => {
  const { marketsData } = getState();
  const marketIdsToLoad = marketIds.filter(
    marketId => !isMarketLoaded(marketId, marketsData)
  );

  if (marketIdsToLoad.length === 0) return callback(null);
  dispatch(loadMarketsInfo(marketIdsToLoad, callback));
  marketIdsToLoad.forEach(marketId =>
    dispatch(loadMarketTradingHistory({ marketId }))
  );
};
