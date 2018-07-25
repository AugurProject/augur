import { UPDATE_REPORTING_WINDOW_STATS } from 'modules/reporting/actions/update-reporting-window-stats'
import { RESET_STATE } from 'modules/app/actions/reset-state'
import { formatAttoRep, formatAttoEth } from 'utils/format-number'

const DEFAULT_STATE = {
  startTime: null,
  endTime: null,
  stake: null,
  reportingFees: {
    unclaimedEth: formatAttoEth(0, { decimals: 4, zeroStyled: true }),
    unclaimedRep: formatAttoRep(0, { decimals: 4, zeroStyled: true }),
    unclaimedForkEth: formatAttoEth(0, { decimals: 4, zeroStyled: true }),
    unclaimedForkRepStaked: formatAttoRep(0, { decimals: 4, zeroStyled: true }),
    feeWindows: [],
    forkedMarket: null,
    nonforkedMarkets: [],
  },
}

export default function (reportingWindowStats = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_REPORTING_WINDOW_STATS:
      return {
        ...reportingWindowStats,
        ...action.data,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return reportingWindowStats
  }
}
