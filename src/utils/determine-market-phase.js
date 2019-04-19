import { constants } from "services/constants";
import { MARKET_STATUS_MESSAGES } from "modules/common-elements/constants";

export default function determineMarketPhase(reportingState) {
  switch (reportingState) {
    case constants.REPORTING_STATE.PRE_REPORTING:
      return MARKET_STATUS_MESSAGES.OPEN;

    case constants.REPORTING_STATE.DESIGNATED_REPORTING:
    case constants.REPORTING_STATE.OPEN_REPORTING:
    case constants.REPORTING_STATE.CROWDSOURCING_DISPUTE:
    case constants.REPORTING_STATE.AWAITING_NEXT_WINDOW:
      return MARKET_STATUS_MESSAGES.IN_REPORTING;

    case constants.REPORTING_STATE.AWAITING_FINALIZATION:
    case constants.REPORTING_STATE.FINALIZED:
      return MARKET_STATUS_MESSAGES.RESOLVED;

    case constants.REPORTING_STATE.FORKING:
      return MARKET_STATUS_MESSAGES.FORKING;

    case constants.REPORTING_STATE.AWAITING_NO_REPORT_MIGRATION:
      return MARKET_STATUS_MESSAGES.AWAITING_NO_REPORT_MIGRATION;

    case constants.REPORTING_STATE.AWAITING_FORK_MIGRATION:
      return MARKET_STATUS_MESSAGES.AWAITING_FORK_MIGRATION;

    default:
      return "";
  }
}
