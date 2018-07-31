import { TYPE_VIEW, TYPE_REPORT, TYPE_DISPUTE, TYPE_TRADE, TYPE_FINALIZE_MARKET, TYPE_CLAIM_PROCEEDS } from 'modules/market/constants/link-types'
import { constants } from 'services/augurjs'
import { isEmpty } from 'lodash'

export const determineMarketLinkType = (market, loginAccount) => {
  if (isEmpty(market) || isEmpty(loginAccount)) return TYPE_VIEW

  const isDesignatedReporter = market.designatedReporter === loginAccount.address
  const { reportingState } = market
  switch (reportingState) {

    case constants.REPORTING_STATE.PRE_REPORTING:
      return TYPE_TRADE

    case constants.REPORTING_STATE.DESIGNATED_REPORTING:
      if (isDesignatedReporter) return TYPE_REPORT

      return TYPE_VIEW

    case constants.REPORTING_STATE.OPEN_REPORTING:
      return TYPE_REPORT

    case constants.REPORTING_STATE.CROWDSOURCING_DISPUTE:
      return TYPE_DISPUTE

    case constants.REPORTING_STATE.AWAITING_NEXT_WINDOW:
      return TYPE_VIEW

    case constants.REPORTING_STATE.AWAITING_FINALIZATION:
      return TYPE_FINALIZE_MARKET

    case constants.REPORTING_STATE.FINALIZED:
      return TYPE_CLAIM_PROCEEDS

    default:
      return TYPE_VIEW
  }
}
