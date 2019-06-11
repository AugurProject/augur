import { augur, constants } from "services/augurjs";
import logError from "utils/log-error";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { filter, head } from "lodash";
import {
  updateDesignatedReportingMarkets,
  updateUpcomingDesignatedReportingMarkets,
  updateOpenMarkets
} from "modules/reports/actions/update-markets-in-reporting-state";
import { AppState } from "store";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { augurSdk } from "services/augursdk";

export const loadReporting = (
  marketIdsParam: any,
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  const designatedReportingParams = {
    universe: universe.id,
    designatedReporter: loginAccount.address
  };

  if (marketIdsParam) {
    dispatch(
      loadMarketsInfoIfNotLoaded(
        marketIdsParam,
        (err: any, marketData: any) => {
          if (err) return logError(err);
          const preReporting: Array<string> = [];
          const designatedReporting: Array<string> = [];
          const openReporting: Array<string> = [];
          if (marketData) {
            Object.keys(marketData).forEach(marketId => {
              const state = marketData[marketId].reportingState;
              if (state === constants.REPORTING_STATE.PRE_REPORTING) {
                preReporting.push(marketId);
              }
              if (state === constants.REPORTING_STATE.DESIGNATED_REPORTING) {
                designatedReporting.push(marketId);
              }
              if (state === constants.REPORTING_STATE.OPEN_REPORTING) {
                openReporting.push(marketId);
              }
            });
            dispatch(updateUpcomingDesignatedReportingMarkets(preReporting));
            dispatch(updateDesignatedReportingMarkets(designatedReporting));
            dispatch(updateOpenMarkets(openReporting));
          }
        }
      )
    );
    return;
  }
  const augur = augurSdk.get();
  if (loginAccount.address) {
    const preReportingIds = await augur.getMarkets({
      reportingState: constants.REPORTING_STATE.PRE_REPORTING,
      sortBy: "endTime",
      ...designatedReportingParams
    });
    dispatch(updateUpcomingDesignatedReportingMarkets(preReportingIds));

    const designatedIds = await augur.getMarkets({
      reportingState: constants.REPORTING_STATE.DESIGNATED_REPORTING,
      sortBy: "endTime",
      ...designatedReportingParams
    });
    dispatch(updateDesignatedReportingMarkets(designatedIds));

    const marketIds = await augur.getMarkets({
      reportingState: constants.REPORTING_STATE.OPEN_REPORTING,
      sortBy: "endTime",
      universe: universe.id
    });

    dispatch(updateOpenMarkets(marketIds));
  }
};
