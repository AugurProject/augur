import { augur, constants } from "services/augurjs";
import logError from "utils/log-error";
import { updateResolvedMarkets } from "modules/reports/actions/update-markets-in-reporting-state";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";
import { augurSdk } from "services/augursdk";

export const loadReportingFinal = (callback: NodeStyleCallback = logError) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  const augur = augurSdk.get();

  const param = {
    reportingState: [
      constants.REPORTING_STATE.FINALIZED,
      constants.REPORTING_STATE.AWAITING_FINALIZATION
    ],
    sortBy: "endTime",
    isSortDescending: true,
    universe: universe.id
  };

  const resolvedMarketIds: Array<string> = await augur.getMarkets(param);
  dispatch(updateResolvedMarkets(resolvedMarketIds));
  callback(null, resolvedMarketIds);

};
