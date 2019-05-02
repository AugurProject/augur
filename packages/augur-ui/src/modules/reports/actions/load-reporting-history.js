import { augur } from "services/augurjs";
import { loadMarketsDisputeInfo } from "modules/markets/actions/load-markets-info";
import { addMarketsReport } from "modules/reports/actions/update-reports";
import logError from "utils/log-error";

export const loadReportingHistory = (
  options = {},
  callback = logError,
  marketIdAggregator
) => dispatch => {
  dispatch(
    loadReportingHistoryInternal(
      options,
      (err, { marketIds = [], universe, reportingHistory = {} }) => {
        if (marketIdAggregator && marketIdAggregator(marketIds));
        if (marketIds && marketIds.length > 0) {
          dispatch(loadMarketsDisputeInfo(marketIds));
          dispatch(addMarketsReport(universe, marketIds));
        }
        if (callback) callback(err, reportingHistory);
      }
    )
  );
};

const loadReportingHistoryInternal = (options = {}, callback) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  if (!loginAccount.address) return callback(null, {});
  augur.reporting.getReportingHistory(
    { ...options, reporter: loginAccount.address, universe: universe.id },
    (err, reportingHistory) => {
      if (err) return callback(err, {});
      if (
        reportingHistory == null ||
        Object.keys(reportingHistory).length === 0
      )
        return callback(null, {});
      callback(null, {
        marketIds: Object.keys(reportingHistory[universe.id]),
        universe: universe.id,
        reportingHistory
      });
    }
  );
};
