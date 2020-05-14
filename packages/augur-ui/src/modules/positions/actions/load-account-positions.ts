import { AppState } from 'appStore';
import { updateAccountPositionsData } from 'modules/positions/actions/account-positions';
import {
  AccountPositionAction,
  AccountPosition,
} from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { AppStatus } from 'modules/app/store/app-status';

export const checkUpdateUserPositions = (marketIds: string[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { accountPositions } = getState();
  const posMarketIds = Object.keys(accountPositions);
  let included = false;
  posMarketIds.map(m => {
    if (marketIds.includes(m)) included = true});
  if (included) {
    dispatch(loadAllAccountPositions());
  }
};

export const loadAllAccountPositions = () => async (dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState) => {
  const { loginAccount: { mixedCaseAddress }, universe: { id: universe }} = AppStatus.get();
  const { updateLoginAccount, updateUserFilledOrders } =  AppStatus.actions;
  const Augur = augurSdk.get();
  const positionsPlus: Getters.Users.UserPositionsPlusResult = await Augur.getUserPositionsPlus({
    account: mixedCaseAddress,
    universe,
  });

  updateUserFilledOrders(mixedCaseAddress, positionsPlus.userTradeHistory);
  if (positionsPlus.userPositions) dispatch(userPositionProcessing(positionsPlus.userPositions));
  if (positionsPlus.userPositionTotals) {
    updateLoginAccount(positionsPlus.userPositionTotals);
  }
};

export const loadAccountOnChainFrozenFundsTotals = () => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, universe: { id: universe }} = AppStatus.get();
  const Augur = augurSdk.get();
  const frozen = await Augur.getTotalOnChainFrozenFunds({
    account: loginAccount.mixedCaseAddress,
    universe,
  });
  AppStatus.actions.updateLoginAccount({ 
    totalFrozenFunds: frozen.totalFrozenFunds,
  });
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
