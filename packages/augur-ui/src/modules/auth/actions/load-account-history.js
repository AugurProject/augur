import { parallel } from "async";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import { loadCreateMarketHistory } from "modules/markets/actions/load-create-market-history";
import { loadFundingHistory } from "modules/account/actions/load-funding-history";
import { loadReportingHistory } from "modules/reports/actions/load-reporting-history";
import { loadAccountCompleteSets } from "modules/positions/actions/load-account-complete-sets";
import {
  TRANSACTIONS_LOADING,
  updateAppStatus
} from "modules/app/actions/update-app-status";
import {
  ALL,
  MARKET_CREATION,
  TRANSFER,
  REPORTING,
  TRADE,
  OPEN_ORDER,
  COMPLETE_SETS_SOLD
} from "modules/transactions/constants/types";
import { clearTransactions } from "modules/transactions/actions/update-transactions-data";
import { loadNotifications } from "modules/notifications/actions/notifications";
import { augur } from "services/augurjs";

export const loadAccountHistory = (beginTime, endTime, type) => (
  dispatch,
  getState
) => {
  const options = {
    earliestCreationTime: beginTime,
    latestCreationTime: endTime,
    transactionType: type || ALL
  };

  loadTransactions(dispatch, getState, options, () => {
    dispatch(updateAppStatus(TRANSACTIONS_LOADING, false));
    dispatch(loadNotifications());
  });
};

function loadTransactions(dispatch, getState, options, cb) {
  const allOptions = Object.assign(options, {
    orderState: augur.constants.ORDER_STATE.ALL
  });
  dispatch(updateAppStatus(TRANSACTIONS_LOADING, true));
  dispatch(clearTransactions());
  parallel(
    [
      next => {
        if (
          allOptions.transactionType !== ALL &&
          allOptions.transactionType !== TRADE &&
          allOptions.transactionType !== OPEN_ORDER &&
          allOptions.transactionType !== COMPLETE_SETS_SOLD
        ) {
          return next(null);
        }
        dispatch(
          loadAccountTrades(allOptions, err => {
            if (err) next(err);
            next(null);
          })
        );
      },
      next => {
        if (
          allOptions.transactionType !== ALL &&
          allOptions.transactionType !== COMPLETE_SETS_SOLD
        ) {
          return next(null);
        }
        dispatch(
          loadAccountCompleteSets(allOptions, err => {
            if (err) next(err);
            next(null);
          })
        );
      },
      next => {
        if (
          allOptions.transactionType !== ALL &&
          allOptions.transactionType !== TRANSFER
        ) {
          return next(null);
        }
        dispatch(
          loadFundingHistory(options, err => {
            if (err) next(err);
            next(null);
          })
        );
      },
      next => {
        if (
          allOptions.transactionType !== ALL &&
          allOptions.transactionType !== MARKET_CREATION
        ) {
          return next(null);
        }
        dispatch(
          loadCreateMarketHistory(options, err => {
            if (err) next(err);
            next(null);
          })
        );
      },
      next => {
        if (
          allOptions.transactionType !== ALL &&
          allOptions.transactionType !== REPORTING
        ) {
          return next(null);
        }
        dispatch(
          loadReportingHistory(options, err => {
            if (err) next(err);
            next(null);
          })
        );
      }
    ],
    err => {
      if (err) return console.error("ERROR loadTransactions: ", err);
      cb(dispatch, getState, options);
    }
  );
}
