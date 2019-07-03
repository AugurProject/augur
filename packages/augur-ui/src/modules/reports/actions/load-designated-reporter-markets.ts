import { REPORTING_STATE } from "modules/common/constants";
import { augurSdk } from "services/augursdk";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import logError from "utils/log-error";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";

export const loadDesignatedReporterMarkets = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  if (!universe.id) return callback(null);
  const {
    DESIGNATED_REPORTING,
    OPEN_REPORTING,
    PRE_REPORTING
  } = REPORTING_STATE;

  const designatedReportingQuery = {
    universe: universe.id,
    reporter: loginAccount.address,
    reportingState: [DESIGNATED_REPORTING, OPEN_REPORTING, PRE_REPORTING],
    designatedReporter: loginAccount.address
  };

  const Augur = augurSdk.get();
  const marketIds = await Augur.getMarkets(designatedReportingQuery);
  dispatch(
    loadMarketsInfoIfNotLoaded(marketIds, (err: any) => {
      if (err) return callback(err);
      callback(null, marketIds);
    })
  );
};
