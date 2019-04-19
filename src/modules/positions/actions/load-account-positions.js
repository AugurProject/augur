import { augur } from "services/augurjs";
import { updateAccountPositionsData } from "modules/positions/actions/update-account-trades-data";
import logError from "utils/log-error";
import { updateTopBarPL } from "modules/positions/actions/update-top-bar-pl";
import { loadUsershareBalances } from "modules/positions/actions/load-user-share-balances";
import { updateLoginAccount } from "modules/auth/actions/update-login-account";
import { getWinningBalance } from "modules/reports/actions/get-winning-balance";

export const loadAccountPositions = (
  options = {},
  callback = logError,
  marketIdAggregator
) => (dispatch, getState) => {
  dispatch(
    loadAccountPositionsInternal(
      options,
      (err, { marketIds = [], positions = {} }) => {
        if (marketIdAggregator && marketIdAggregator(marketIds));
        if (!err) postProcessing(marketIds, dispatch, positions, callback);
      }
    )
  );
};

const loadAccountPositionsInternal = (options = {}, callback) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null, {});
  augur.trading.getUserTradingPositions(
    { ...options, account: loginAccount.address, universe: universe.id },
    (err, positions) => {
      if (err) return callback(err, {});
      if (positions == null || positions.tradingPositions == null) {
        return callback(null, {});
      }

      if (!options.marketId) {
        dispatch(
          updateLoginAccount({
            totalFrozenFunds: positions.frozenFundsTotal.frozenFunds,
            tradingPositionsTotal: positions.tradingPositionsTotal
          })
        );
      }

      const marketIds = Array.from(
        new Set([
          ...positions.tradingPositions.reduce(
            (p, position) => [...p, position.marketId],
            []
          )
        ])
      );

      if (marketIds.length === 0) return callback(null, {});
      dispatch(loadUsershareBalances(marketIds));
      dispatch(getWinningBalance(marketIds));
      callback(err, { marketIds, positions });
    }
  );
};

const postProcessing = (marketIds, dispatch, positions, callback) => {
  marketIds.forEach(marketId => {
    const marketPositionData = {};
    const marketPositions = positions.tradingPositions.filter(
      position => position.marketId === marketId
    );
    const outcomeIds = Array.from(
      new Set([
        ...marketPositions.reduce((p, position) => [...p, position.outcome], [])
      ])
    );
    marketPositionData[marketId] = {
      tradingPositionsPerMarket:
        (positions.tradingPositionsPerMarket &&
          positions.tradingPositionsPerMarket[marketId]) ||
        {},
      tradingPositions: {}
    };
    outcomeIds.forEach(outcomeId => {
      marketPositionData[marketId].tradingPositions[
        outcomeId
      ] = positions.tradingPositions.filter(
        position =>
          position.marketId === marketId && position.outcome === outcomeId
      )[0];
    });
    dispatch(updateAccountPositionsData(marketPositionData, marketId));
  });
  dispatch(updateTopBarPL());
  if (callback) callback(null, positions);
};
