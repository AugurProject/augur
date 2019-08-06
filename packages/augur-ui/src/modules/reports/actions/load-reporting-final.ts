import logError from "utils/log-error";
import { updateResolvedMarkets } from "modules/reports/actions/update-markets-in-reporting-state";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";
import { augurSdk } from "services/augursdk";
import { REPORTING_STATE } from "modules/common/constants";

export const loadReportingFinal = (callback: NodeStyleCallback = logError) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  const augur = augurSdk.get();

  const param = {
    reportingState: [
      REPORTING_STATE.FINALIZED,
      REPORTING_STATE.AWAITING_FINALIZATION,
    ],
    sortBy: "endTime",
    isSortDescending: true,
    universe: universe.id,
  };

  const marketList = await augur.getMarkets(param);
  const resolvedMarketIds: string[] = marketList.markets.map(marketInfo => marketInfo.id);
  dispatch(updateResolvedMarkets(resolvedMarketIds));
  callback(null, resolvedMarketIds);

};
