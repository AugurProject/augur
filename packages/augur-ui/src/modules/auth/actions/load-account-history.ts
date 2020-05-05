import { userPositionProcessing } from 'modules/positions/actions/load-account-positions';
import { updateUserFilledOrders, bulkMarketTradingHistory, refreshUserOpenOrders } from 'modules/markets/actions/market-trading-history-management';
import { clearTransactions } from 'modules/transactions/actions/update-transactions-data';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'appStore';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { AppStatus } from 'modules/app/store/app-status';

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
  const { loginAccount } = appState;
  const { mixedCaseAddress } = loginAccount;
  dispatch(loadDisputeWindow()); // need to load dispute window for user to claim reporting fees
  const { universe } = AppStatus.get();
  const { updateLoginAccount: AppStatusUpdateLoginAccount } = AppStatus.actions;
  const Augur = augurSdk.get();
  const userData: Getters.Users.UserAccountDataResult = await Augur.getUserAccountData({universe: universe.id, account: mixedCaseAddress})
  dispatch(updateUserFilledOrders(mixedCaseAddress, userData.userTradeHistory));
  dispatch(bulkMarketTradingHistory(userData.marketTradeHistory));

  const marketsDataById = userData.marketsInfo.reduce((acc, marketData) => ({
    [marketData.id]: marketData,
    ...acc,
  }), {});

  dispatch(updateMarketsData(marketsDataById));
  dispatch(updateLoginAccount({ reporting: userData.userStakedRep }));
  if (userData.userOpenOrders) dispatch(refreshUserOpenOrders(userData.userOpenOrders.orders));
  if (userData.userPositions) dispatch(userPositionProcessing(userData.userPositions));
  if (userData.userPositionTotals) dispatch(updateLoginAccount(userData.userPositionTotals));

  if (userData.userOpenOrders)
    dispatch(
      updateLoginAccount({
        totalOpenOrdersFrozenFunds:
          userData.userOpenOrders.totalOpenOrdersFrozenFunds,
      })
    );
  AppStatusUpdateLoginAccount({
    reporting: userData.userStakedRep,
    totalOpenOrdersFrozenFunds: userData.userOpenOrders.totalOpenOrdersFrozenFunds,
    ...userData.userPositionTotals,
  })
}
