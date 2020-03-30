import { isMarketLoaded } from "modules/markets/helpers/is-market-loaded";
import {
  updateMarketsData
} from "modules/markets/actions/update-markets-data";
import logError from "utils/log-error";
import { AppState } from "appStore";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { augurSdk } from "services/augursdk";

export const loadMarketsInfo = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (!marketIds || marketIds === undefined || marketIds.length === 0) {
    return callback(null, []);
  }
  const augur = augurSdk.get();
  const marketInfoArray = await augur.getMarketsInfo({ marketIds });
  if (marketInfoArray == null || !marketInfoArray.length)
    return callback("no markets data received");
  const universeId = getState().universe.id;
  const marketInfos = marketInfoArray
    .filter(marketHasData => marketHasData)
    .reduce((p, marketData) => {
      if (marketData === null || marketData.id == null || marketData.universe !== universeId) return p;

      return {
        ...p,
        [marketData.id]: marketData
      };
    }, {});

  if (!Object.keys(marketInfos).length)
    return callback("no marketIds in collection");

  dispatch(updateMarketsData(marketInfos));
  callback(null, marketInfos);
};

export const loadMarketsInfoIfNotLoaded = (
  marketIds: string[],
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { marketInfos } = getState();
  const marketIdsToLoad = marketIds.filter(
    (marketId: string) => !isMarketLoaded(marketId, marketInfos)
  );

  if (marketIdsToLoad.length === 0) return callback(null);
  dispatch(loadMarketsInfo(marketIdsToLoad, callback));
};
