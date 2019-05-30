import { augur } from "services/augurjs";
import { isMarketLoaded } from "modules/markets/helpers/is-market-loaded";
import {
  updateMarketsData,
  updateMarketsDisputeInfo,
} from "modules/markets/actions/update-markets-data";
import { getDisputeInfo } from "modules/reports/actions/get-dispute-info";
import logError from "utils/log-error";
import { AppState } from "store";
import { Action } from "redux";
import { MarketData, NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";

export const loadMarketsInfo = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  if (!marketIds || marketIds.length === 0) {
    return callback(null, []);
  }

  augur.markets.getMarketsInfo(
    { marketIds },
    (err: any, marketsDataArray: Array<MarketData>) => {
      if (err) return callback(err);

      if (marketsDataArray == null || !marketsDataArray.length)
        return callback("no markets data received");
      const universeId = getState().universe.id;
      const marketsData = marketsDataArray
        .filter((marketHasData) => marketHasData)
        .reduce((p, marketData) => {
          if (marketData.id == null || marketData.universe !== universeId)
            return p;

          return {
            ...p,
            [marketData.id]: marketData,
          };
        }, {});

      if (!Object.keys(marketsData).length)
        return callback("no marketIds in collection");

      dispatch(updateMarketsData(marketsData));
      callback(null, marketsData);
    },
  );
};

export const loadMarketsInfoIfNotLoaded = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState): void => {
  const { marketsData } = getState();
  const marketIdsToLoad = marketIds.filter(
    (marketId: string) => !isMarketLoaded(marketId, marketsData),
  );

  if (marketIdsToLoad.length === 0) return callback(null);
  dispatch(loadMarketsInfo(marketIdsToLoad, callback));
};

export const loadMarketsDisputeInfo = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>): void => {
  dispatch(
    getDisputeInfo(
      marketIds,
      (err: any, marketsDisputeInfoArray: Array<string>) => {
        if (err) return callback(err);
        if (!marketsDisputeInfoArray.length) return callback(null);
        const marketsDisputeInfo = marketsDisputeInfoArray.reduce(
          (p, marketDisputeInfo: any) => ({
            ...p,
            [marketDisputeInfo.marketId]: marketDisputeInfo,
          }),
          {},
        );
        dispatch(
          loadMarketsInfoIfNotLoaded(marketIds, () => {
            dispatch(updateMarketsDisputeInfo(marketsDisputeInfo));
            callback(null);
          }),
        );
      },
    ),
  );
};
