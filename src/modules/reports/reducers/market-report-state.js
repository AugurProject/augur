import { RESET_STATE } from "modules/app/actions/reset-state";
import {
  UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS,
  UPDATE_DESIGNATED_REPORTING_MARKETS,
  UPDATE_OPEN_REPORTING_MARKETS,
  UPDATE_AWAITING_DISPUTE_MARKETS,
  UPDATE_CROWD_DISPUTE_MARKETS,
  UPDATE_RESOLVED_REPORTING_MARKETS
} from "modules/reports/actions/update-markets-in-reporting-state";
import { REMOVE_MARKET } from "modules/markets/actions/update-markets-data";

const DEFAULT_STATE = {
  designated: [],
  open: [],
  upcoming: [],
  awaiting: [],
  dispute: [],
  resolved: []
};

export default function(marketReportState = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_DESIGNATED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        designated: data.marketIds
      };

    case UPDATE_OPEN_REPORTING_MARKETS:
      return {
        ...marketReportState,
        open: data.marketIds
      };

    case UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        upcoming: data.marketIds
      };

    case UPDATE_AWAITING_DISPUTE_MARKETS:
      return {
        ...marketReportState,
        awaiting: data.marketIds
      };

    case UPDATE_CROWD_DISPUTE_MARKETS:
      return {
        ...marketReportState,
        dispute: data.marketIds
      };
    case UPDATE_RESOLVED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        resolved: data.marketIds
      };
    case REMOVE_MARKET:
      return Object.keys(marketReportState).reduce((p, reportType) => {
        const markets = marketReportState[reportType].filter(
          marketId => marketId !== data.marketId
        );
        return {
          ...p,
          [reportType]: markets
        };
      }, {});
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return marketReportState;
  }
}
