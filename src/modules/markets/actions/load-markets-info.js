import { augur } from "services/augurjs";
import { isMarketLoaded } from "modules/markets/helpers/is-market-loaded";
import { loadMarketTradingHistory } from "modules/markets/actions/market-trading-history-management";
import {
  updateMarketsData,
  updateMarketsDisputeInfo
} from "modules/markets/actions/update-markets-data";
import { getDisputeInfo } from "modules/reports/actions/get-dispute-info";
import {
  updateMarketLoading,
  removeMarketLoading
} from "modules/markets/actions/update-market-loading";
import logError from "utils/log-error";
import {
  MARKET_INFO_LOADING,
  MARKET_INFO_LOADED
} from "modules/markets/constants/market-loading-states";

export const loadMarketsInfo = (marketIds, callback = logError) => (
  dispatch,
  getState
) => {
  if (!marketIds || marketIds.length === 0) {
    return callback(null, []);
  }
  marketIds.map(marketId =>
    dispatch(updateMarketLoading({ [marketId]: MARKET_INFO_LOADING }))
  );

  augur.markets.getMarketsInfo({ marketIds }, (err, marketsDataArray) => {
    if (err) return loadingError(dispatch, callback, err, marketIds);

    if (marketsDataArray == null || !marketsDataArray.length)
      return loadingError(
        dispatch,
        callback,
        `no markets data received`,
        marketIds
      );
    const universeId = getState().universe.id;
    const marketsData = marketsDataArray
      .filter(marketHasData => marketHasData)
      .reduce((p, marketData) => {
        if (marketData.id == null || marketData.universe !== universeId)
          return p;

        return {
          ...p,
          [marketData.id]: marketData
        };
      }, {});

    if (!Object.keys(marketsData).length)
      return loadingError(dispatch, callback, null, marketIds);

    Object.keys(marketsData).forEach(marketId =>
      dispatch(updateMarketLoading({ [marketId]: MARKET_INFO_LOADED }))
    );
    dispatch(updateMarketsData(marketsData));
    callback(null, marketsData);
  });
};

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

export const loadMarketsDisputeInfo = (marketIds, callback = logError) => (
  dispatch,
  getState
) => {
  dispatch(
    getDisputeInfo(marketIds, (err, marketsDisputeInfoArray) => {
      if (err) return callback(err);
      if (!marketsDisputeInfoArray.length) return callback(null);
      const marketsDisputeInfo = marketsDisputeInfoArray.reduce(
        (p, marketDisputeInfo) => ({
          ...p,
          [marketDisputeInfo.marketId]: marketDisputeInfo
        }),
        {}
      );
      dispatch(updateMarketsDisputeInfo(marketsDisputeInfo));
      callback(null);
    })
  );
};

function loadingError(dispatch, callback, error, marketIds) {
  (marketIds || []).map(marketId => dispatch(removeMarketLoading(marketId)));
  callback(error);
}
