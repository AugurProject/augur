import { augur, constants } from "services/augurjs";
import logError from "utils/log-error";
import {
  updateAwaitingDisputeMarkets,
  updateCrowdDisputeMarkets
} from "modules/reports/actions/update-markets-in-reporting-state";
import async from "async";
import { loadMarketsDisputeInfo } from "modules/markets/actions/load-markets-info";

export const loadDisputing = (callback: Function = logError) => (
  dispatch: Function,
  getState: Function
) => {
  const { universe } = getState();
  const args = {
    sortBy: "endTime",
    isSortDescending: false,
    universe: universe.id
  };
  async.parallel(
    [
      next =>
        augur.augurNode.submitRequest(
          "getMarkets",
          {
            reportingState: [
              constants.REPORTING_STATE.CROWDSOURCING_DISPUTE,
              constants.REPORTING_STATE.AWAITING_FORK_MIGRATION
            ],
            ...args
          },
          (err: any, result: any) => {
            if (err) return next(err);
            dispatch(loadMarketsDisputeInfo(result));
            dispatch(updateCrowdDisputeMarkets(result));
            next(null);
          }
        ),
      next =>
        augur.augurNode.submitRequest(
          "getMarkets",
          {
            reportingState: constants.REPORTING_STATE.AWAITING_NEXT_WINDOW,
            ...args
          },
          (err: any, result: any) => {
            if (err) return next(err);
            dispatch(updateAwaitingDisputeMarkets(result));
            next(null);
          }
        )
    ],
    err => {
      if (err) callback(err);
      callback(null);
    }
  );
};
