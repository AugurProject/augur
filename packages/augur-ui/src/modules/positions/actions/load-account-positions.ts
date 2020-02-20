import logError from 'utils/log-error';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { AppState } from 'appStore';
import { updateAccountPositionsData } from 'modules/positions/actions/account-positions';
import {
  AccountPositionAction,
  AccountPosition,
  NodeStyleCallback,
} from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';

export const loadAllAccountPositions = (
  callback: NodeStyleCallback = logError,
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(
    loadAccountPositionsInternal(
      (err: any, { positions = {} }: any) => {
        if (!err) userPositionProcessing(positions, dispatch, callback);
        dispatch(loadAccountPositionsTotals());
      }
    )
  );
};

export const loadAccountPositionsTotals = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const positions = await Augur.getProfitLossSummary({
    account: loginAccount.mixedCaseAddress,
    universe: universe.id,
  });
  const frozen = await Augur.getTotalOnChainFrozenFunds({
    account: loginAccount.mixedCaseAddress,
    universe: universe.id,
  });
  dispatch(
    updateLoginAccount({
      totalFrozenFunds: frozen.totalFrozenFunds,
      totalRealizedPL: positions[30].realized,
      tradingPositionsTotal: { unrealizedRevenue24hChangePercent : positions[1].unrealizedPercent },
    })
  );
};

export const loadAccountOnChainFrozenFundsTotals = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const frozen = await Augur.getTotalOnChainFrozenFunds({
    account: loginAccount.mixedCaseAddress,
    universe: universe.id,
  });
  dispatch(
    updateLoginAccount({
      totalFrozenFunds: frozen.totalFrozenFunds,
    })
  );
};

const loadAccountPositionsInternal = (
  callback: NodeStyleCallback
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address == null || universe.id == null)
    return callback(null, {});
  const Augur = augurSdk.get();
  const positions = await Augur.getUserTradingPositions({
    account: loginAccount.mixedCaseAddress,
    universe: universe.id,
  });
  if (positions == null || positions.tradingPositions == null) {
    return callback(null, {});
  }

  const marketIds = Array.from(
    new Set([
      ...positions.tradingPositions.reduce(
        (p: any, position: any) => [...p, position.marketId],
        []
      ),
    ])
  );

  if (marketIds.length === 0) return callback(null, {});
  callback(null, { marketIds, positions });
};

export const userPositionProcessing = (
  positions: Getters.Users.UserTradingPositions,
  dispatch: ThunkDispatch<void, any, Action>,
  callback?: NodeStyleCallback
) => {
  if (!positions || !positions.tradingPositions) {
    if (callback) return callback(null);
    return;
  }

  const userPositionsMarketIds: string[] = Array.from(
    new Set([
      ...positions.tradingPositions.reduce(
        (p, position) => [...p, position.marketId],
        []
      ),
    ])
  );
  userPositionsMarketIds.forEach((marketId: string) => {
    const marketPositionData: AccountPosition = {};
    const marketPositions = positions.tradingPositions.filter(
      (position: any) => position.marketId === marketId
    );
    const outcomeIds: number[] = Array.from(
      new Set([
        ...marketPositions.reduce(
          (p: number[], position: Getters.Users.TradingPosition) => [
            ...p,
            position.outcome,
          ],
          []
        ),
      ])
    );
    marketPositionData[marketId] = {
      tradingPositions: {},
    };

    if (
      positions.tradingPositionsPerMarket &&
      positions.tradingPositionsPerMarket[marketId]
    ) {
      // @ts-ignore
      marketPositionData[marketId].tradingPositionsPerMarket =
        positions.tradingPositionsPerMarket[marketId];
    }

    outcomeIds.forEach((outcomeId: number) => {
      marketPositionData[marketId].tradingPositions[
        outcomeId
      ] = positions.tradingPositions.filter(
        (position: Getters.Users.TradingPosition) =>
          position.marketId === marketId && position.outcome === outcomeId
      )[0];
    });
    const positionData: AccountPositionAction = {
      marketId,
      positionData: marketPositionData,
    };
    dispatch(updateAccountPositionsData(positionData));
  });
  if (callback) callback(null, positions);
};
