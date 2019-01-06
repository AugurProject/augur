import { augur } from "services/augurjs";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { updateAccountPositionsData } from "modules/positions/actions/update-account-trades-data";
import logError from "utils/log-error";
import { updateTopBarPL } from "modules/positions/actions/update-top-bar-pl";

export const loadAccountPositions = (options = {}, callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null);
  augur.trading.getUserTradingPositions(
    { ...options, account: loginAccount.address, universe: universe.id },
    (err, positions) => {
      if (err) return callback(err);
      if (positions == null) return callback(null);
      const marketIds = Array.from(
        new Set([
          ...positions.reduce((p, position) => [...p, position.marketId], [])
        ])
      );
      if (marketIds.length === 0) return callback(null);
      dispatch(
        loadMarketsInfoIfNotLoaded(marketIds, err => {
          if (err) return callback(err);
          marketIds.forEach(marketId => {
            const marketPositionData = {};
            const marketPositions = positions.filter(
              position => position.marketId === marketId
            );
            marketPositionData[marketId] = {};
            const outcomeIds = Array.from(
              new Set([
                ...marketPositions.reduce(
                  (p, position) => [...p, position.outcome],
                  []
                )
              ])
            );
            outcomeIds.forEach(outcomeId => {
              marketPositionData[marketId][outcomeId] = positions.filter(
                position =>
                  position.marketId === marketId &&
                  position.outcome === outcomeId
              )[0];
            });
            dispatch(updateAccountPositionsData(marketPositionData, marketId));
          });
          dispatch(updateTopBarPL());
          callback(null, positions);
        })
      );
    }
  );
};
