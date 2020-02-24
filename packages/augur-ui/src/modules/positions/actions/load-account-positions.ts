import logError from 'utils/log-error';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { AppState } from 'store';
import { updateAccountPositionsData } from 'modules/positions/actions/account-positions';
import {
  AccountPositionAction,
  AccountPosition,
} from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { updateUserFilledOrders } from 'modules/markets/actions/market-trading-history-management';

export const loadAllAccountPositions = () => async (dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState) => {
  const { universe, loginAccount } = getState();
  const { mixedCaseAddress } = loginAccount;
  const Augur = augurSdk.get();
  const positionsPlus: Getters.Users.UserPositionsPlusResult = await Augur.getUserPositionsPlus({
    account: loginAccount.mixedCaseAddress,
    universe: universe.id,
  });

  dispatch(updateUserFilledOrders(mixedCaseAddress, positionsPlus.userTradeHistory));
  if (positionsPlus.userPositions) dispatch(userPositionProcessing(positionsPlus.userPositions));
  if (positionsPlus.userPositionTotals) dispatch(updateLoginAccount(positionsPlus.userPositionTotals));
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

export const userPositionProcessing = (
  positions: Getters.Users.UserTradingPositions,
) => (
  dispatch: ThunkDispatch<void, any, Action>,
) => {
  if (!positions || !positions.tradingPositions) {
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
};
