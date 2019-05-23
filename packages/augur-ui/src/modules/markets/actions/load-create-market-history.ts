import { augur } from "services/augurjs";
import logError from "utils/log-error";

export function loadCreateMarketHistory(
  options = {},
  callback = logError,
  marketIdAggregator: Function | undefined
) {
  return (dispatch: Function, getState: Function) => {
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

  function loadCreateMarketHistoryInternal(options = {}, callback: Function) {
    return (dispatch: Function, getState: Function) => {
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
