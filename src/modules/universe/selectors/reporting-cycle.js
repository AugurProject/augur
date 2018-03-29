import { BigNumber } from 'utils/wrapped-big-number'
import { createSelector } from 'reselect'
import moment from 'moment'
import store from 'src/store'
import { selectBlockchainCurrentBlockTimestamp, selectUniverseReportingPeriodDurationInSeconds } from 'src/select-state'
import { augur } from 'services/augurjs'
import { ONE } from 'modules/trade/constants/numbers'

export default function () {
  return selectReportingCycle(store.getState())
}

export const selectReportingCycle = createSelector(
  selectUniverseReportingPeriodDurationInSeconds,
  selectBlockchainCurrentBlockTimestamp,
  (reportingPeriodDurationInSeconds, timestamp) => {
    const currentReportingPeriodPercentComplete = augur.reporting.getCurrentPeriodProgress(reportingPeriodDurationInSeconds || 0, timestamp)
    const bnReportingPeriodDurationInSeconds = new BigNumber(reportingPeriodDurationInSeconds || 0, 10)
    const secondsRemaining = ONE.minus(new BigNumber(currentReportingPeriodPercentComplete, 10).dividedBy(100)).times(bnReportingPeriodDurationInSeconds)
    return {
      currentReportingPeriodPercentComplete,
      reportingCycleTimeRemaining: moment.duration(secondsRemaining.toNumber(), 'seconds').humanize(true),
    }
  },
)
