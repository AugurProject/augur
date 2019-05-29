import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";

export function loadCreateMarketHistory(
  options = {},
  callback = logError,
  marketIdAggregator: Function | undefined
) {
  return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
    dispatch(
      loadCreateMarketHistoryInternal(
        options,
        (err: any, marketIds: Array<string> = []) => {
          if (marketIdAggregator) marketIdAggregator(marketIds);
          if (callback) callback(err, marketIds);
        }
      )
    );
  };

  function loadCreateMarketHistoryInternal(options = {}, callback: NodeStyleCallback) {
    return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
      const { universe, loginAccount } = getState();
      if (!loginAccount.address) return callback(null);
      augur.markets.getMarkets(
        { ...options, creator: loginAccount.address, universe: universe.id },
        (err: any, marketsCreatedByUser: Array<string>) => {
          // note: marketsCreatedByUser is an array of market IDs
          if (err) return callback(err);
          if (
            marketsCreatedByUser == null ||
            (Array.isArray(marketsCreatedByUser) &&
              marketsCreatedByUser.length === 0)
          ) {
            return callback(null);
          }
          callback(err, marketsCreatedByUser);
        }
      );
    };
  }
}
