import { augur } from "services/augurjs";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { addReportingTransactions } from "modules/transactions/actions/add-transactions";
import { addMarketsReport } from "modules/reports/actions/update-reports";
import { loadMarketsDisputeInfo } from "modules/markets/actions/load-markets-dispute-info";
import logError from "utils/log-error";

export const loadReportingHistory = (options = {}, callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  augur.reporting.getReportingHistory(
    { ...options, reporter: loginAccount.address, universe: universe.id },
    (err, reportingHistory) => {
      if (err) return callback(err);
      if (
        reportingHistory == null ||
        Object.keys(reportingHistory).length === 0
      )
        return callback(null);
      const marketIds = Object.keys(reportingHistory[universe.id]);
      dispatch(
        loadMarketsInfoIfNotLoaded(marketIds, err => {
          if (err) return callback(err);

          dispatch(loadMarketsDisputeInfo(marketIds));
          dispatch(addReportingTransactions(reportingHistory));
          dispatch(addMarketsReport(universe.id, marketIds));
          // TODO update user's reporting history
          callback(null, reportingHistory);
        })
      );
    }
  );
};
