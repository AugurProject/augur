import { augur, constants } from "services/augurjs";
import logError from "utils/log-error";
import { updateResolvedMarkets } from "modules/reports/actions/update-markets-in-reporting-state";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

export const loadReportingFinal = (callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
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
    (err: any, resolvedMarketIds: Array<string>) => {
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
