import logError from "utils/log-error";
import {
  updateAwaitingDisputeMarkets,
  updateCrowdDisputeMarkets
} from "modules/reports/actions/update-markets-in-reporting-state";
import async from "async";
import { loadMarketsDisputeInfo } from "modules/markets/actions/load-markets-info";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";
import { augurSdk } from "services/augursdk";
import { REPORTING_STATE } from "modules/common/constants";

export const loadDisputing = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  const args = {
    sortBy: "endTime",
    isSortDescending: false,
    universe: universe.id
  };
  const augur = augurSdk.get();
  const disputingMarkets =         {
    reportingState: [
      REPORTING_STATE.CROWDSOURCING_DISPUTE,
      REPORTING_STATE.AWAITING_FORK_MIGRATION
    ],
    ...args
  };
  const awaitingMarkets = {
    reportingState: REPORTING_STATE.AWAITING_NEXT_WINDOW,
    ...args
  };
  const disputing = await augur.getMarkets(disputingMarkets);
  dispatch(loadMarketsDisputeInfo(disputing));
  dispatch(updateCrowdDisputeMarkets(disputing));
  const awaiting = await augur.getMarkets(awaitingMarkets);
  dispatch(updateAwaitingDisputeMarkets(awaiting));
  callback(null);
};
