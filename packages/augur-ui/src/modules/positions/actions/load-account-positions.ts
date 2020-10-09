import {
  AccountPositionAction,
  AccountPosition,
} from 'modules/types';
import { augurSdk } from 'services/augursdk';
import type { Getters } from '@augurproject/sdk';
import { AppStatus } from 'modules/app/store/app-status';
import { isSameAddress } from 'utils/isSameAddress';
import { Markets } from 'modules/markets/store/markets';
import { Betslip } from 'modules/trading/store/betslip';
import { createBigNumber } from 'utils/create-big-number';
import { convertPositionToBet } from 'utils/betslip-helpers';
import { ZERO } from 'modules/common/constants';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';

export const checkUpdateUserPositions = (marketIds: string[]) => {
  const { accountPositions, loginAccount: { address } } = AppStatus.get();
  const { marketInfos } = Markets.get();
  const posMarketIds = Object.keys(accountPositions);
  const markMarketIds: string[] = Object.keys(marketInfos)
    .filter(m => isSameAddress(marketInfos[m].author, address))
    .map(m => marketInfos[m].id);
  const userMarketIds = [...posMarketIds, ...markMarketIds];
  let included = false;
  userMarketIds.map(m => {
    if (marketIds.includes(m)) included = true;
  });
  if (included) {
    loadAllAccountPositions();
  }
};

export const loadAllAccountPositions = async () => {
  const { loginAccount: { mixedCaseAddress }, universe: { id: universe }} = AppStatus.get();
  const { updateLoginAccount, updateUserFilledOrders } =  AppStatus.actions;
  const Augur = augurSdk.get();
  const positionsPlus: Getters.Users.UserPositionsPlusResult = await Augur.getUserPositionsPlus({
    account: mixedCaseAddress,
    universe,
  });

  updateUserFilledOrders(mixedCaseAddress, positionsPlus.userTradeHistory);
  if (positionsPlus.userPositions) userPositionProcessing(positionsPlus.userPositions);
  if (positionsPlus.userPositionTotals) {
    updateLoginAccount(positionsPlus.userPositionTotals);
  }
};

export const loadAccountOnChainFrozenFundsTotals = async () => {
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
  const { marketInfos } = Markets.get();

  userPositionsMarketIds.forEach((marketId: string) => {
    const marketPositionData: AccountPosition = {};
    const marketInfo = marketInfos[marketId];
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
    AppStatus.actions.updateAccountPositions(positionData);

    Object.values(positionData.positionData[marketId].tradingPositions).map(position => {
      if (marketInfo?.sportsBook && (position.priorPosition ? createBigNumber(position.priorPosition.netPosition).gte(0) : createBigNumber(position.netPosition).gte(ZERO))) {
        Betslip.actions.addMatched(false, marketId, marketInfo.sportsBook, marketInfo.description, convertPositionToBet(position, marketInfo));
        Markets.actions.updateOrderBook(marketId, null, loadMarketOrderBook(marketId));  
      }      
      });
  });
};
