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

export default function(marketReportState = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_DESIGNATED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        designated: action.data
      };

    case UPDATE_OPEN_REPORTING_MARKETS:
      return {
        ...marketReportState,
        open: action.data
      };

    case UPDATE_UPCOMING_DESIGNATED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        upcoming: action.data
      };

    case UPDATE_AWAITING_DISPUTE_MARKETS:
      return {
        ...marketReportState,
        awaiting: action.data
      };

    case UPDATE_CROWD_DISPUTE_MARKETS:
      return {
        ...marketReportState,
        dispute: action.data
      };
    case UPDATE_RESOLVED_REPORTING_MARKETS:
      return {
        ...marketReportState,
        resolved: action.data
      };
    case REMOVE_MARKET:
      return Object.keys(marketReportState).reduce((p, type) => {
        const markets = marketReportState[type].filter(
          marketId => marketId !== action.marketId
        );
        return {
          ...p,
          [type]: markets
        };
      }, {});
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return marketReportState;
  }
}
