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
  const { universe, loginAccount } = appState;
  const { mixedCaseAddress } = loginAccount;
  dispatch(loadDisputeWindow()); // need to load dispute window for user to claim reporting fees

  const Augur = augurSdk.get();
  const userData: Getters.Users.UserAccountDataResult = await Augur.getUserAccountData({universe: universe.id, account: mixedCaseAddress})
  dispatch(updateUserFilledOrders(mixedCaseAddress, userData.userTradeHistory));
  dispatch(bulkMarketTradingHistory(userData.marketTradeHistory));

  const marketsDataById = userData.marketsInfo.reduce((acc, marketData) => ({
    [marketData.id]: marketData,
    ...acc,
  }), {});

  dispatch(updateMarketsData(marketsDataById));
  if (userData.userOpenOrders) dispatch(refreshUserOpenOrders(userData.userOpenOrders.orders));
  dispatch(updateLoginAccount({ reporting: userData.userStakedRep }));
  if (userData.userPositions) userPositionProcessing(userData.userPositions, dispatch);
  if (userData.userPositionTotals) dispatch(updateLoginAccount(userData.userPositionTotals));
  if (userData.userOpenOrders)
    dispatch(
      updateLoginAccount({
        totalOpenOrdersFrozenFunds:
          userData.userOpenOrders.totalOpenOrdersFrozenFunds,
      })
    );
}
