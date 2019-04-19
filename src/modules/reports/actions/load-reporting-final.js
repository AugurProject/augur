import { augur, constants } from "services/augurjs";
import logError from "utils/log-error";
import { updateResolvedMarkets } from "modules/reports/actions/update-markets-in-reporting-state";

export const loadReportingFinal = (callback = logError) => (
  dispatch,
  getState
) => {
  const { universe } = getState();
  augur.augurNode.submitRequest(
    "getMarkets",
    {
      reportingState: [
        constants.REPORTING_STATE.FINALIZED,
        constants.REPORTING_STATE.AWAITING_FINALIZATION
      ],
      sortBy: "endTime",
      isSortDescending: true,
      universe: universe.id
    },
    (err, resolvedMarketIds) => {
      if (err) return callback(err);

      if (!resolvedMarketIds || resolvedMarketIds.length === 0) {
        dispatch(updateResolvedMarkets([]));
        return callback(null, []);
      }

      dispatch(updateResolvedMarkets(resolvedMarketIds));
      callback(null, resolvedMarketIds);
    }
  );
};
