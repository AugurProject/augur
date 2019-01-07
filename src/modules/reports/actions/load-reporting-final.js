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
      reportingState: constants.REPORTING_STATE.FINALIZED,
      sortBy: "finalizationBlockNumber",
      isSortDescending: true,
      universe: universe.id
    },
    (err, finalizedMarketIds) => {
      if (err) return callback(err);

      augur.augurNode.submitRequest(
        "getMarkets",
        {
          reportingState: constants.REPORTING_STATE.AWAITING_FINALIZATION,
          sortBy: "endTime",
          isSortDescending: true,
          universe: universe.id
        },
        (err, awaitingFinalizationMarketIds) => {
          if (err) return callback(err);

          const marketIds = awaitingFinalizationMarketIds.concat(
            finalizedMarketIds
          );
          if (!marketIds || marketIds.length === 0) {
            dispatch(updateResolvedMarkets([]));
            return callback(null);
          }

          dispatch(updateResolvedMarkets(marketIds));
          callback(null, marketIds);
        }
      );
    }
  );
};
