import type { Getters } from '@augurproject/sdk';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { userPositionProcessing } from 'modules/positions/actions/load-account-positions';
import { augurSdk } from 'services/augursdk';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';

export const loadAccountHistory = () => {
  loadTransactions();
};

async function loadTransactions() {
  loadDisputeWindow(); // need to load dispute window for user to claim reporting fees
  const {
    loginAccount: { mixedCaseAddress },
    universe,
  } = AppStatus.get();
  const { updateLoginAccount, refreshUserOpenOrders, updateUserFilledOrders } = AppStatus.actions;
  const { updateMarketsData, bulkMarketTradingHistory } = Markets.actions;
  const Augur = augurSdk.get();
  const userData: Getters.Users.UserAccountDataResult = await Augur.getUserAccountData(
    { universe: universe.id, account: mixedCaseAddress }
  );
  updateUserFilledOrders(mixedCaseAddress, userData.userTradeHistory);
  bulkMarketTradingHistory(userData.userTradeHistory, null);

  const marketsDataById = userData.marketsInfo.reduce(
    (acc, marketData) => ({
      [marketData.id]: marketData,
      ...acc,
    }),
    {}
  );

  updateMarketsData(marketsDataById);
  if (userData.userOpenOrders)
    refreshUserOpenOrders(userData.userOpenOrders.orders);
  if (userData.userPositions)
    userPositionProcessing(userData.userPositions);

  updateLoginAccount({
    reporting: userData.userStakedRep,
    totalOpenOrdersFrozenFunds:
      userData.userOpenOrders.totalOpenOrdersFrozenFunds,
    ...userData.userPositionTotals,
  });
}
