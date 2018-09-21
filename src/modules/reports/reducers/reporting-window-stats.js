import { UPDATE_REPORTING_WINDOW_STATS } from "modules/reports/actions/update-reporting-window-stats";
import { RESET_STATE } from "modules/app/actions/reset-state";
import { formatAttoRep, formatAttoEth } from "utils/format-number";

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
    feeWindowEthFees: "0",
    feeWindowRepStaked: "0"
  }
};

export default function(reportingWindowStats = DEFAULT_STATE, { type, data }) {
  switch (type) {
    case UPDATE_REPORTING_WINDOW_STATS: {
      const { windowStats } = data;
      return {
        ...reportingWindowStats,
        ...windowStats
      };
    }
    case RESET_STATE:
      return DEFAULT_STATE;
    default:
      return reportingWindowStats;
  }
}
