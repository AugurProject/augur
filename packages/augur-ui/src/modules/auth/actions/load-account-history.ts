import { userPositionProcessing } from 'modules/positions/actions/load-account-positions';
import {
  bulkMarketTradingHistory,
} from 'modules/markets/actions/market-trading-history-management';
import { clearTransactions } from 'modules/transactions/actions/update-transactions-data';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from 'modules/markets/store/markets';

export const loadAccountHistory = (): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(clearTransactions());
  loadTransactions(dispatch, getState());
};

async function loadTransactions(
  dispatch: ThunkDispatch<void, any, Action>,
  appState: AppState
) {
  dispatch(loadDisputeWindow()); // need to load dispute window for user to claim reporting fees
  const {
    loginAccount: { mixedCaseAddress },
    universe,
  } = AppStatus.get();
  const { updateLoginAccount, refreshUserOpenOrders, updateUserFilledOrders } = AppStatus.actions;
  const Augur = augurSdk.get();
  const userData: Getters.Users.UserAccountDataResult = await Augur.getUserAccountData(
    { universe: universe.id, account: mixedCaseAddress }
  );
  updateUserFilledOrders(mixedCaseAddress, userData.userTradeHistory);
  dispatch(bulkMarketTradingHistory(userData.marketTradeHistory));

  const marketsDataById = userData.marketsInfo.reduce(
    (acc, marketData) => ({
      [marketData.id]: marketData,
      ...acc,
    }),
    {}
  );

  Markets.actions.updateMarketsData(marketsDataById);
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
