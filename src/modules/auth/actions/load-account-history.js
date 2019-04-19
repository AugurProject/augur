import { augur } from "services/augurjs";
import { loadAccountPositions } from "modules/positions/actions/load-account-positions";
import { loadAccountOrders } from "modules/orders/actions/load-account-orders";
import { loadCreateMarketHistory } from "modules/markets/actions/load-create-market-history";
import { loadReportingHistory } from "modules/reports/actions/load-reporting-history";
import {
  TRANSACTIONS_LOADING,
  updateAppStatus
} from "modules/app/actions/update-app-status";
import { loadUserMarketTradingHistory } from "modules/markets/actions/market-trading-history-management";
import { clearTransactions } from "modules/transactions/actions/update-transactions-data";
import { loadAlerts } from "modules/alerts/actions/alerts";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

export const loadAccountHistory = () => (dispatch, getState) => {
  dispatch(updateAppStatus(TRANSACTIONS_LOADING, true));
  dispatch(clearTransactions());
  loadTransactions(dispatch, () => {
    dispatch(updateAppStatus(TRANSACTIONS_LOADING, false));
    dispatch(loadAlerts());
  });
};

function loadTransactions(dispatch, callback) {
  const options = {};
  dispatch(loadUserMarketTradingHistory(options));
  const promises = [];
  promises.push(
    new Promise(resolve =>
      dispatch(loadAccountPositions(options, null, resolve))
    )
  );
  promises.push(
    new Promise(resolve =>
      dispatch(
        loadAccountOrders(
          { ...options, orderState: augur.constants.ORDER_STATE.ALL },
          null,
          resolve
        )
      )
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
      new Set(marketIds.reduce((p, mids) => p.concat(mids), []))
    );

    dispatch(loadMarketsInfoIfNotLoaded(uniqMarketIds), () => {
      callback();
    });
  });
}
