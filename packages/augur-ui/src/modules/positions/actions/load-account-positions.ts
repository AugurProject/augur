import logError from 'utils/log-error';
import { updateTopBarPL } from 'modules/positions/actions/update-top-bar-pl';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { AppState } from 'store';
import { updateAccountPositionsData } from 'modules/positions/actions/account-positions';
import {
  PositionData,
  AccountPositionAction,
  PositionsTotal,
  AccountPosition,
  TradingPositionsPerMarket,
  NodeStyleCallback,
} from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';

interface UserTradingPositions {
  frozenFundsTotal: {
    frozenFunds: string;
  };
  tradingPositions: Array<PositionData>;
  tradingPositionsPerMarket: TradingPositionsPerMarket;
  tradingPositionsTotal?: PositionsTotal;
}

export const loadAllAccountPositions = (
  options: any = {},
  callback: NodeStyleCallback = logError,
  marketIdAggregator: Function | undefined
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(
    loadAccountPositionsInternal(
      options,
      (err: any, { marketIds = [], positions = {} }: any) => {
        if (marketIdAggregator) marketIdAggregator(marketIds);
        if (!err) postProcessing(marketIds, dispatch, positions, callback);
      }
    )
  );
};

export const loadMarketAccountPositions = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(
    loadAccountPositionsInternal(
      { marketId },
      (err: any, { marketIds = [], positions = {} }: any) => {
        if (!err) postProcessing(marketIds, dispatch, positions, callback);
        dispatch(loadAccountPositionsTotals());
      }
    )
  );
};

export const loadAccountPositionsTotals = (
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  const Augur = augurSdk.get();
  const positions = await Augur.getUserTradingPositions({
    account: loginAccount.address,
    universe: universe.id,
  });
  dispatch(
    updateLoginAccount({
      totalFrozenFunds: positions.frozenFundsTotal,
      // TODO: put in github tix to get `unrealizedRevenue24hChangePercent` added
      //      tradingPositionsTotal: positions.tradingPositionsTotal,
    })
  );
};

const loadAccountPositionsInternal = (
  options: any = {},
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
    ...options,
    account: loginAccount.address,
    universe: universe.id,
  });
  if (positions == null || positions.tradingPositions == null) {
    return callback(null, {});
  }

  if (!options.marketId) {
    dispatch(
      updateLoginAccount({
        totalFrozenFunds: positions.frozenFundsTotal,
        // TODO: put in github tix to get `unrealizedRevenue24hChangePercent` added
        //      tradingPositionsTotal: positions.tradingPositionsTotal,
      })
    );
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

const postProcessing = (
  marketIds: Array<string>,
  dispatch: ThunkDispatch<void, any, Action>,
  positions: UserTradingPositions,
  callback: NodeStyleCallback
) => {
  marketIds.forEach((marketId: string) => {
    const marketPositionData: AccountPosition = {};
    const marketPositions = positions.tradingPositions.filter(
      (position: any) => position.marketId === marketId
    );
    const outcomeIds: Array<number> = Array.from(
      new Set([
        ...marketPositions.reduce(
          (p: Array<number>, position: PositionData) => [
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
        (position: PositionData) =>
          position.marketId === marketId && position.outcome === outcomeId
      )[0];
    });
    const positionData: AccountPositionAction = {
      marketId,
      positionData: marketPositionData,
    };
    dispatch(updateAccountPositionsData(positionData));
  });
  dispatch(updateTopBarPL());
  if (callback) callback(null, positions);
};
