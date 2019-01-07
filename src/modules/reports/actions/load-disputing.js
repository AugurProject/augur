import { augur, constants } from "services/augurjs";
import logError from "src/utils/log-error";
import {
  updateAwaitingDisputeMarkets,
  updateCrowdDisputeMarkets
} from "modules/reports/actions/update-markets-in-reporting-state";
import async from "async";

export const loadDisputing = (callback = logError) => (dispatch, getState) => {
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
            reportingState: constants.REPORTING_STATE.CROWDSOURCING_DISPUTE,
            ...args
          },
          (err, result) => {
            if (err) return next(err);

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
          (err, result) => {
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
