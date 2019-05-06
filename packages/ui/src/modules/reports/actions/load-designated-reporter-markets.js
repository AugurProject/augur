import { augur, constants } from "services/augurjs";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import logError from "utils/log-error";

export const loadDesignatedReporterMarkets = (callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  if (!universe.id) return callback(null);
  const {
    DESIGNATED_REPORTING,
    OPEN_REPORTING,
    PRE_REPORTING
  } = constants.REPORTING_STATE;

  const designatedReportingQuery = {
    universe: universe.id,
    reporter: loginAccount.address,
    reportingState: [DESIGNATED_REPORTING, OPEN_REPORTING, PRE_REPORTING],
    designatedReporter: loginAccount.address
  };

  augur.markets.getMarkets(designatedReportingQuery, (err, marketIds) => {
    if (err) return callback(err);
    dispatch(
      loadMarketsInfoIfNotLoaded(marketIds, err => {
        if (err) return callback(err);
        callback(null, marketIds);
      })
    );
  });
};
