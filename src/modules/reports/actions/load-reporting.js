import { augur, constants } from "services/augurjs";
import logError from "utils/log-error";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

import {
  updateDesignatedReportingMarkets,
  updateUpcomingDesignatedReportingMarkets,
  updateOpenMarkets
} from "modules/reports/actions/update-markets-in-reporting-state";

export const loadReporting = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState();
  const designatedReportingParams = {
    universe: universe.id,
    designatedReporter: loginAccount.address
  };

  augur.augurNode.submitRequest(
    "getMarkets",
    {
      reportingState: constants.REPORTING_STATE.PRE_REPORTING,
      sortBy: "endTime",
      ...designatedReportingParams
    },
    (err, marketIds) => {
      if (err) return callback(err);
      if (!marketIds || marketIds.length === 0 || isNaN(loginAccount.address)) {
        dispatch(updateUpcomingDesignatedReportingMarkets([]));
        return callback(null);
      }

      dispatch(
        loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
          if (err) return logError(err);
          dispatch(updateUpcomingDesignatedReportingMarkets(marketIds));
        })
      );
    }
  );

  augur.augurNode.submitRequest(
    "getMarkets",
    {
      reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
      sortBy: "endTime",
      ...designatedReportingParams
    },
    (err, marketIds) => {
      if (err) return callback(err);
      if (!marketIds || marketIds.length === 0 || isNaN(loginAccount.address)) {
        dispatch(updateDesignatedReportingMarkets([]));
        return callback(null);
      }
      dispatch(
        loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
          if (err) return logError(err);
          dispatch(updateDesignatedReportingMarkets(marketIds));
        })
      );
    }
  );

  augur.augurNode.submitRequest(
    "getMarkets",
    {
      reportingState: constants.REPORTING_STATE.OPEN_REPORTING,
      sortBy: "endTime",
      universe: universe.id
    },
    (err, marketIds) => {
      if (err) return callback(err);
      if (!marketIds || marketIds.length === 0) {
        dispatch(updateOpenMarkets([]));
        return callback(null);
      }

      dispatch(
        loadMarketsInfoIfNotLoaded(marketIds, (err, marketData) => {
          if (err) return logError(err);
          dispatch(updateOpenMarkets(marketIds));
        })
      );
    }
  );
};
