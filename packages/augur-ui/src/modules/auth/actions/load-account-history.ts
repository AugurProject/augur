import type { Getters } from '@augurproject/sdk';
import { AppState } from 'appStore';
import { updateLoginAccount } from 'modules/account/actions/login-account';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import {
  bulkMarketTradingHistory,
  refreshUserOpenOrders,
  updateUserFilledOrders,
} from 'modules/markets/actions/market-trading-history-management';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';
import { updateAccountPositionsData, updateAccountRawPositionsData } from 'modules/positions/actions/account-positions';
import { userPositionProcessing } from 'modules/positions/actions/load-account-positions';
import { clearTransactions } from 'modules/transactions/actions/update-transactions-data';
import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { augurSdk } from 'services/augursdk';

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
  dispatch(updateLoginAccount({ reporting: userData.userStakedRep }));
  if (userData.userOpenOrders) dispatch(refreshUserOpenOrders(userData.userOpenOrders.orders));
  if (userData.userPositions) {
    const positionData = userPositionProcessing(userData.userPositions);
    positionData.map( data => dispatch(updateAccountPositionsData(data)))
  }
  if (userData.userRawPositions) {
    const positionData = userPositionProcessing(userData.userRawPositions);
    positionData.map(data => dispatch(updateAccountRawPositionsData(data)))
  }
  if (userData.userPositionTotals) dispatch(updateLoginAccount(userData.userPositionTotals));

  if (userData.userOpenOrders)
    dispatch(
      updateLoginAccount({
        totalOpenOrdersFrozenFunds:
          userData.userOpenOrders.totalOpenOrdersFrozenFunds,
      })
    );
}
