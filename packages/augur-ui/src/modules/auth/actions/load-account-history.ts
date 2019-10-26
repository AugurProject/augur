import { loadAllAccountPositions } from 'modules/positions/actions/load-account-positions';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { loadCreateMarketHistory } from 'modules/markets/actions/load-create-market-history';
import { loadUserFilledOrders, updateUserFilledOrders, bulkMarketTradingHistory } from 'modules/markets/actions/market-trading-history-management';
import { clearTransactions } from 'modules/transactions/actions/update-transactions-data';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';
import { AppState } from 'store';
import { loadAccountReportingHistory } from 'modules/auth/actions/load-account-reporting';
import { loadDisputeWindow } from 'modules/auth/actions/load-dispute-window';
import { augurSdk } from 'services/augursdk';
import { Getters } from '@augurproject/sdk';
import { updateMarketsData } from 'modules/markets/actions/update-markets-data';

export const loadAccountHistory = (): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(clearTransactions());
  loadTransactions(dispatch, getState(), () => {});
};

async function loadTransactions(
  dispatch: ThunkDispatch<void, any, Action>,
  appState: AppState,
  callback: NodeStyleCallback
) {
  const { universe, loginAccount } = appState;
  const { address } = loginAccount;
  dispatch(loadDisputeWindow()); // need to load dispute window for user to claim reporting fees
  dispatch(loadCreateMarketHistory()); // uses getMarkets so marketInfo objects are already returned
  const options = {};
  const promises = [];

  const Augur = augurSdk.get();
  const userData: Getters.Users.UserAccountDataResult = await Augur.getUserAccountData({universe: universe.id, account: address})
  dispatch(updateUserFilledOrders(address, userData.userTradeHistory));
  dispatch(bulkMarketTradingHistory(userData.marketTradeHistory));
  const marketsDataById = userData.marketsInfo.reduce((acc, marketData) => ({
    [marketData.id]: marketData,
    ...acc,
  }), {});
  dispatch(updateMarketsData(marketsDataById));

  promises.push(
    new Promise(resolve =>
      dispatch(loadAllAccountPositions(options, null, resolve))
    )
  );

  promises.push(
    new Promise(resolve => dispatch(loadAccountOpenOrders(options, resolve)))
  );

  promises.push(
    new Promise(resolve => dispatch(loadAccountReportingHistory(resolve)))
  );

  Promise.all(promises).then((marketIds: string[][]) => {
    marketIds = [...marketIds, Object.keys(appState.pendingOrders)];

    const uniqMarketIds: string[] = Array.from(
      new Set(
        marketIds.reduce(
          (p, mids) => p.concat(mids.filter(m => m !== null)),
          []
        )
      )
    );

    // dispatch(getWinningBalance(uniqMarketIds));
    dispatch(
      loadMarketsInfoIfNotLoaded(uniqMarketIds, () => {
        callback(null);
      })
    );
  });
}
