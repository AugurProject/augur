import { augur } from "services/augurjs";
import { loadMarketsDisputeInfo } from "modules/markets/actions/load-markets-info";
import { addMarketsReport } from "modules/reports/actions/update-reports";
import logError from "utils/log-error";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";

export const loadReportingHistory = (
  options = {},
  callback: NodeStyleCallback = logError,
  marketIdAggregator: Function
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  dispatch(
    loadReportingHistoryInternal(
      options,
      (err: any, { marketIds = [], universe, reportingHistory = {} }: any) => {
        if (marketIdAggregator) marketIdAggregator(marketIds);
        if (marketIds && marketIds.length > 0) {
          dispatch(loadMarketsDisputeInfo(marketIds));
          dispatch(addMarketsReport(universe, marketIds));
        }
        if (callback) callback(err, reportingHistory);
      }
    )
  );
};

const loadReportingHistoryInternal = (
  options: any = {},
  callback: NodeStyleCallback,
) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { universe, loginAccount } = getState();
  if (!loginAccount.address) return callback(null, {});
  augur.reporting.getReportingHistory(
    { ...options, reporter: loginAccount.address, universe: universe.id },
    (err: any, reportingHistory: any) => {
      if (err) return callback(err, {});
      if (
        reportingHistory == null ||
        Object.keys(reportingHistory).length === 0
      )
        return callback(null, {});
      callback(null, {
        marketIds: Object.keys(reportingHistory[universe.id]),
        universe: universe.id,
        reportingHistory
      });
    }
  );
};
