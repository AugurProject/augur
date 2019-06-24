import { loadAccountPositions } from 'modules/positions/actions/load-account-positions';
import { loadAccountOpenOrders } from 'modules/orders/actions/load-account-open-orders';
import { loadCreateMarketHistory } from 'modules/markets/actions/load-create-market-history';
import { loadReportingHistory } from 'modules/reports/actions/load-reporting-history';
import { loadUserFilledOrders } from 'modules/markets/actions/market-trading-history-management';
import { clearTransactions } from 'modules/transactions/actions/update-transactions-data';
import { loadAlerts } from 'modules/alerts/actions/alerts';
import { loadUsershareBalances } from 'modules/positions/actions/load-user-share-balances';
import { getWinningBalance } from 'modules/reports/actions/get-winning-balance';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';
import { AppState } from 'store';

export const loadAccountHistory = (): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  dispatch(clearTransactions());
  loadTransactions(dispatch, () => {
    dispatch(loadAlerts());
  });
};

function loadTransactions(
  dispatch: ThunkDispatch<void, any, Action>,
  callback: NodeStyleCallback
) {
  const options = {};
  const promises = [];
  promises.push(
    new Promise(resolve =>
      dispatch(loadUserFilledOrders(options, resolve))
    )
  );
  promises.push(
    new Promise(resolve =>
      dispatch(loadAccountPositions(options, null, resolve))
    )
  );
  promises.push(
    new Promise(resolve =>
      dispatch(loadAccountOpenOrders(options, resolve))
    )
  );
  promises.push(
    new Promise(resolve =>
      dispatch(loadCreateMarketHistory(options, null, resolve))
    )
  );
  promises.push(
    new Promise(resolve =>
      dispatch(loadReportingHistory(options, null, resolve))
    )
  );

  Promise.all(promises).then(marketIds => {
    const uniqMarketIds = Array.from(
      new Set(
        marketIds.reduce(
          (p, mids) => p.concat(mids.filter(m => m !== null)),
          []
        )
      )
    );

    dispatch(loadUsershareBalances(uniqMarketIds));
    dispatch(getWinningBalance(uniqMarketIds));
    dispatch(loadMarketsInfoIfNotLoaded(uniqMarketIds), () => {
      callback();
    });
  });
}
