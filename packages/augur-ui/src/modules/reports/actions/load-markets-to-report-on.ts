import { parallel } from "async-es";
import { updateMarketsData } from "modules/markets/actions/update-markets-data";
import { updateMarketsWithAccountReportData } from "modules/reports/actions/update-markets-with-account-report-data";
import logError from "utils/log-error";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { augurSdk } from "services/augursdk";

export const loadMarketsToReportOn = (
  options: any,
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { env, universe, loginAccount } = getState();
  if (!loginAccount.address) return callback(null);
  if (!loginAccount.rep || loginAccount.rep === "0") return callback(null);
  if (!universe.id) return callback(null);
  const query = {
    ...options,
    universe: universe.id,
    reporter: loginAccount.address
  };

  const designatedReportingQuery = {
    ...query,
    reportingState: "DESIGNATED_REPORTING",
    designatedReporter: loginAccount.address
  };
  const openReportingQuery = { ...query, reportingState: "OPEN_REPORTING" };
  const reportingQuery = { ...query, reportingState: "CROWDSOURCING_DISPUTE" };
  const augur = augurSdk.get();

  // TODO: refactor to combine all 3 reporting states into one call to get markets,
  // not sure how the result is shaped currently
  const marketsTypes = {
    designatedReporting: await augur.getMarkets(designatedReportingQuery),
    openReporting: await augur.getMarkets(openReportingQuery),
    reporting: await augur.getMarkets(reportingQuery)
  };

  dispatch(updateMarketsData(marketsTypes));
  dispatch(updateMarketsWithAccountReportData(marketsTypes));
  callback(null, marketsTypes);
};
