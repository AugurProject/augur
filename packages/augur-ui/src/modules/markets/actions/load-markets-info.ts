import { isMarketLoaded } from "modules/markets/helpers/is-market-loaded";

import logError from "utils/log-error";
import { NodeStyleCallback } from "modules/types";
import { ThunkAction } from "redux-thunk";
import { augurSdk } from "services/augursdk";
import { AppStatus } from "modules/app/store/app-status";
import { Markets } from "../store/markets";

const NO_MARKET_INFOS = { marketInfos: {} };

export const loadMarketsInfo = (
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError,
): ThunkAction<any, any, any, any> => async () => {
  if (!marketIds || marketIds === undefined || marketIds.length === 0) {
    callback(null, []);
    return NO_MARKET_INFOS;
  }
  const augur = augurSdk.get();
  const marketInfoArray = await augur.getMarketsInfo({ marketIds });
  if (marketInfoArray == null || !marketInfoArray.length) {
    callback("no markets data received", []);
    return NO_MARKET_INFOS;
  }
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
  if (!Object.keys(marketInfos).length) {
    callback("no marketIds in collection", []);
    return NO_MARKET_INFOS;
  }

  callback(null, marketInfos);
  return { marketInfos };
};

export const loadMarketsInfoIfNotLoaded = (
  marketIds: string[],
  callback: NodeStyleCallback = logError
) => {
  const { marketInfos } = Markets.get();
  const marketIdsToLoad = marketIds.filter(
    (marketId: string) => !isMarketLoaded(marketId, marketInfos)
  );

  if (marketIdsToLoad.length === 0) return callback(null);
  Markets.actions.updateMarketsData(null, loadMarketsInfo(marketIdsToLoad, callback));
};
