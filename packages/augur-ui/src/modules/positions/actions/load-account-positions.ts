import type { Getters } from '@augurproject/sdk';
import { isSameAddress } from 'utils/isSameAddress';
import { AppState } from 'appStore';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { updateUserFilledOrders } from 'modules/markets/actions/market-trading-history-management';
import { updateAccountPositionsData, updateAccountRawPositionsData } from 'modules/positions/actions/account-positions';
import { AccountPosition, AccountPositionAction } from 'modules/types';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';

export const checkUpdateUserPositions = (marketIds: string[]) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { accountPositions, marketInfos, loginAccount } = getState();
  const posMarketIds = Object.keys(accountPositions);
  const markMarketIds: string[] = Object.keys(marketInfos)
    .filter(m => isSameAddress(marketInfos[m].author, loginAccount.address))
    .map(m => marketInfos[m].id);
  const userMarketIds = [...posMarketIds, ...markMarketIds];
  let included = false;
  userMarketIds.map(m => {
    if (marketIds.includes(m)) included = true;
  });
  if (included) {
    dispatch(loadAllAccountPositions());
  }
};

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
  if (positionsPlus.userPositions) {
    const positionData = userPositionProcessing(positionsPlus.userPositions);
    if (positionData) positionData.map(data => dispatch(updateAccountPositionsData(data)));
  }
  if (positionsPlus.userRawPositions) {
    const positionData = userPositionProcessing(positionsPlus.userRawPositions);
    if (positionData) positionData.map(data => dispatch(updateAccountRawPositionsData(data)));
  }

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
) => {
  if (!positions || !positions.tradingPositions) {
    return null;
  }

  const userPositionsMarketIds: string[] = Array.from(
    new Set([
      ...positions.tradingPositions.reduce(
        (p, position) => [...p, position.marketId],
        []
      ),
    ])
  );

  return userPositionsMarketIds.map((marketId: string) => {
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
    return  {
      marketId,
      positionData: marketPositionData,
    };
  });
};
