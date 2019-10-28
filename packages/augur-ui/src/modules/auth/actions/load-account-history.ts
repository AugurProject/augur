import { loadAllAccountPositions, userPositionProcessing } from 'modules/positions/actions/load-account-positions';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { loadCreateMarketHistory } from 'modules/markets/actions/load-create-market-history';
import { loadUserFilledOrders, updateUserFilledOrders, bulkMarketTradingHistory, updateUserOpenOrders } from 'modules/markets/actions/market-trading-history-management';
import { clearTransactions } from 'modules/transactions/actions/update-transactions-data';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from 'store';
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
  const { address } = loginAccount;
  dispatch(loadDisputeWindow()); // need to load dispute window for user to claim reporting fees

  const Augur = augurSdk.get();
  const userData: Getters.Users.UserAccountDataResult = await Augur.getUserAccountData({universe: universe.id, account: address})
  dispatch(updateUserFilledOrders(address, userData.userTradeHistory));
  dispatch(bulkMarketTradingHistory(userData.marketTradeHistory));

  const marketsDataById = userData.marketsInfo.reduce((acc, marketData) => ({
    [marketData.id]: marketData,
    ...acc,
  }), {});

  dispatch(updateMarketsData(marketsDataById));
  dispatch(updateUserOpenOrders(userData.userOpenOrders));
  dispatch(updateLoginAccount({ reporting: userData.userStakedRep }));
  userPositionProcessing(userData.userPositions, dispatch);
  dispatch(updateLoginAccount(userData.userPositionTotals));
}
