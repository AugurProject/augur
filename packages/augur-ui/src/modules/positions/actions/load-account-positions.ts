import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { updateTopBarPL } from "modules/positions/actions/update-top-bar-pl";
import { updateLoginAccount } from "modules/account/actions/login-account";
import {
  updateAccountPositionsData,
} from "modules/positions/actions/account-positions";
import { AccountPosition } from "modules/types";

export const loadAccountPositions = (
  options: any = {},
  callback: Function = logError,
  marketIdAggregator: Function | undefined,
) => (dispatch: Function) => {
  dispatch(
    loadAccountPositionsInternal(
      options,
      (err: any, { marketIds = [], positions = {} }: any) => {
        if (marketIdAggregator) marketIdAggregator(marketIds);
        if (!err) postProcessing(marketIds, dispatch, positions, callback);
      },
    ),
  );
};

export const loadMarketAccountPositions = (
  marketId: string,
  callback = logError,
) => (dispatch: Function) => {
  dispatch(
    loadAccountPositionsInternal(
      { marketId },
      (err: any, { marketIds = [], positions = {} }: any) => {
        if (!err) postProcessing(marketIds, dispatch, positions, callback);
        dispatch(loadAccountPositionsTotals());
      },
    ),
  );
};

export const loadAccountPositionsTotals = (callback = logError) => (
  dispatch: Function,
  getState: Function,
) => {
  const { universe, loginAccount } = getState();
  augur.trading.getUserTradingPositions(
    { account: loginAccount.address, universe: universe.id },
    (err: any, positions: any) => {
      if (err) return callback(err, {});
      dispatch(
        updateLoginAccount({
          totalFrozenFunds: positions.frozenFundsTotal.frozenFunds,
          tradingPositionsTotal: positions.tradingPositionsTotal,
        }),
      );
    },
  );
};

const loadAccountPositionsInternal = (
  options: any = {},
  callback: Function,
) => (dispatch: Function, getState: Function) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null, {});
  augur.trading.getUserTradingPositions(
    { ...options, account: loginAccount.address, universe: universe.id },
    (err: any, positions: any) => {
      if (err) return callback(err, {});
      if (positions == null || positions.tradingPositions == null) {
        return callback(null, {});
      }

      if (!options.marketId) {
        dispatch(
          updateLoginAccount({
            totalFrozenFunds: positions.frozenFundsTotal.frozenFunds,
            tradingPositionsTotal: positions.tradingPositionsTotal,
          }),
        );
      }

      const marketIds = Array.from(
        new Set([
          ...positions.tradingPositions.reduce(
            (p: any, position: any) => [...p, position.marketId],
            [],
          ),
        ]),
      );

      if (marketIds.length === 0) return callback(null, {});
      callback(err, { marketIds, positions });
    },
  );
};

const postProcessing = (
  marketIds: Array<string>,
  dispatch: Function,
  positions: any,
  callback: Function,
) => {
  marketIds.forEach((marketId) => {
    const marketPositionData = {};
    const marketPositions = positions.tradingPositions.filter(
      (position: any) => position.marketId === marketId,
    );
    const outcomeIds = Array.from(
      new Set([
        ...marketPositions.reduce(
          (p: any, position: any) => [...p, position.outcome],
          [],
        ),
      ]),
    );
    marketPositionData[marketId] = {
      tradingPositionsPerMarket:
        (positions.tradingPositionsPerMarket &&
          positions.tradingPositionsPerMarket[marketId]) ||
        {},
      tradingPositions: {},
    };
    outcomeIds.forEach((outcomeId) => {
      marketPositionData[marketId].tradingPositions[
        outcomeId
      ] = positions.tradingPositions.filter(
        (position: any) =>
          position.marketId === marketId && position.outcome === outcomeId,
      )[0];
    });
    const positionData: AccountPosition = {
      marketId,
      positionData: marketPositionData,
    };
    dispatch(updateAccountPositionsData(positionData));
  });
  dispatch(updateTopBarPL());
  if (callback) callback(null, positions);
};
