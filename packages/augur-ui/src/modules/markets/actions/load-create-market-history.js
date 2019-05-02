import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { loadUnclaimedFees } from "modules/markets/actions/market-creator-fees-management";

export function loadCreateMarketHistory(
  options = {},
  callback = logError,
  marketIdAggregator
) {
  return (dispatch, getState) => {
    dispatch(
      loadCreateMarketHistoryInternal(options, (err, marketIds = []) => {
        if (marketIdAggregator && marketIdAggregator(marketIds));
        if (callback) callback(err, marketIds);
      })
    );
  };

  function loadCreateMarketHistoryInternal(options = {}, callback) {
    return (dispatch, getState) => {
      const { universe, loginAccount } = getState();
      if (!loginAccount.address) return callback(null);
      augur.markets.getMarkets(
        { ...options, creator: loginAccount.address, universe: universe.id },
        (err, marketsCreatedByUser) => {
          // note: marketsCreatedByUser is an array of market IDs
          if (err) return callback(err);
          if (
            marketsCreatedByUser == null ||
            (Array.isArray(marketsCreatedByUser) &&
              marketsCreatedByUser.length === 0)
          ) {
            return callback(null);
          }
          dispatch(loadUnclaimedFees(marketsCreatedByUser));
          callback(err, marketsCreatedByUser);
        }
      );
    };
  }
}
