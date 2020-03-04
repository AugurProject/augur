import {
  TYPE_VIEW,
  TYPE_REPORT,
  TYPE_DISPUTE,
  TYPE_TRADE,
  TYPE_CLAIM_PROCEEDS
} from "modules/common/constants";
import { REPORTING_STATE } from "modules/common/constants";
import { isEmpty } from "utils/is-empty";

export const determineMarketLinkType = (market, loginAccount) => {
  if (isEmpty(market) || !loginAccount.address) return TYPE_VIEW;

  const isDesignatedReporter =
    market.designatedReporter === loginAccount.address;
  const { reportingState } = market;
  switch (reportingState) {
    case REPORTING_STATE.PRE_REPORTING:
      return TYPE_TRADE;

    case REPORTING_STATE.DESIGNATED_REPORTING:
      if (isDesignatedReporter) return TYPE_REPORT;

      return TYPE_VIEW;

    case REPORTING_STATE.OPEN_REPORTING:
      return TYPE_REPORT;

    case REPORTING_STATE.CROWDSOURCING_DISPUTE:
      return TYPE_DISPUTE;

    case REPORTING_STATE.AWAITING_NEXT_WINDOW:
      return TYPE_VIEW;

    case REPORTING_STATE.FINALIZED:
      return TYPE_CLAIM_PROCEEDS;

    default:
      return TYPE_VIEW;
  }
};
