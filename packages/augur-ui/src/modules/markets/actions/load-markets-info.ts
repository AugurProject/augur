import { isMarketLoaded } from "modules/markets/helpers/is-market-loaded";

import logError from "utils/log-error";
import { AppState } from "appStore";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { augurSdk } from "services/augursdk";
import { AppStatus } from "modules/app/store/app-status";
import { Markets } from "../store/markets";
import { MARKETS_ACTIONS } from "../store/constants";

export const loadMarketsInfo = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError,
): ThunkAction<any, any, any, any> => async () => {
  if (!marketIds || marketIds === undefined || marketIds.length === 0) {
    return callback(null, []);
  }
  const augur = augurSdk.get();
  const marketInfoArray = await augur.getMarketsInfo({ marketIds });
  if (marketInfoArray == null || !marketInfoArray.length)
    return callback("no markets data received");
  const { universe: { id: universeId }} = AppStatus.get();
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

  //if (!payload) Markets.actions.updateMarketsData(marketInfos);

  callback(null, marketInfos);
  return {marketInfos: marketInfos};
};

export const loadMarketsInfoIfNotLoaded = (
  marketIds: string[],
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => {
  const { marketInfos } = Markets.get();
  const marketIdsToLoad = marketIds.filter(
    (marketId: string) => !isMarketLoaded(marketId, marketInfos)
  );

  if (marketIdsToLoad.length === 0) return callback(null);
  Markets.actions.updateMarketsData(null, loadMarketsInfo(marketIdsToLoad, callback));
};
