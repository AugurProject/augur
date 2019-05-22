import { augur } from "services/augurjs";
import { isMarketLoaded } from "modules/markets/helpers/is-market-loaded";
import {
  updateMarketsData,
  updateMarketsDisputeInfo
} from "modules/markets/actions/update-markets-data";
import { getDisputeInfo } from "modules/reports/actions/get-dispute-info";
import logError from "utils/log-error";

export const loadMarketsInfo = (
  marketIds: Array<string>,
  callback: Function = logError
) => (dispatch: Function, getState: Function) => {
  if (!marketIds || marketIds.length === 0) {
    return callback(null, []);
  }

  augur.markets.getMarketsInfo(
    { marketIds },
    (err: any, marketsDataArray: Array<any>) => {
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

      dispatch(updateMarketsData(marketsData));
      callback(null, marketsData);
    }
  );
};

export const loadMarketsInfoIfNotLoaded = (
  marketIds: Array<string>,
  callback: Function = logError
) => (dispatch: Function, getState: Function) => {
  const { marketsData } = getState();
  const marketIdsToLoad = marketIds.filter(
    marketId => !isMarketLoaded(marketId, marketsData)
  );

  if (marketIdsToLoad.length === 0) return callback(null);
  dispatch(loadMarketsInfo(marketIdsToLoad, callback));
};

export const loadMarketsDisputeInfo = (
  marketIds: Array<string>,
  callback: Function = logError
) => (dispatch: Function, getState: Function) => {
  dispatch(
    getDisputeInfo(
      marketIds,
      (err: any, marketsDisputeInfoArray: Array<string>) => {
        if (err) return callback(err);
        if (!marketsDisputeInfoArray.length) return callback(null);
        const marketsDisputeInfo = marketsDisputeInfoArray.reduce(
          (p, marketDisputeInfo: any) => ({
            ...p,
            [marketDisputeInfo.marketId]: marketDisputeInfo
          }),
          {}
        );
        dispatch(
          loadMarketsInfoIfNotLoaded(marketIds, () => {
            dispatch(updateMarketsDisputeInfo(marketsDisputeInfo));
            callback(null);
          })
        );
      }
    )
  );
};

function loadingError(
  dispatch: Function,
  callback: Function,
  error: any,
  marketIds: Array<string>
) {
  callback(error);
}
