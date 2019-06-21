import { augur } from "services/augurjs";
import { augurSdk } from "services/augursdk";
import logError from "utils/log-error";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";

export function loadCreateMarketHistory(
  options = {},
  callback: NodeStyleCallback = logError,
  marketIdAggregator: Function | undefined
) {
  return (
    dispatch: ThunkDispatch<void, any, Action>
  ) => {
    loadCreateMarketHistoryInternal(
      options,
      (err: any, marketIds: Array<string> = []) => {
        if (marketIdAggregator) marketIdAggregator(marketIds);
        if (callback) callback(err, marketIds);
      }
    );
  };

  function loadCreateMarketHistoryInternal(
    options = {},
    callback: NodeStyleCallback
  ) {
    return async (
      dispatch: ThunkDispatch<void, any, Action>,
      getState: () => AppState
    ) => {
      const { universe, loginAccount } = getState();
      if (!loginAccount.address) return callback(null);
      const Augur = augurSdk.get();
      const universeId = universe.id;
      if (universeId) {
        const marketsCreatedByUser = await Augur.getMarkets({
          ...options,
          creator: loginAccount.address,
          universe: universeId
        });

        if (
          marketsCreatedByUser == null ||
          (Array.isArray(marketsCreatedByUser) &&
            marketsCreatedByUser.length === 0)
        ) {
          return callback(null);
        }
        callback(null, marketsCreatedByUser);
      }
    };
  }
}
