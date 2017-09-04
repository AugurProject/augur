import BigNumber from 'bignumber.js';
import { createSelector } from 'reselect';
import moment from 'moment';
import store from 'src/store';
import { selectBlockchainCurrentBlockTimestamp, selectBranchPeriodLength } from 'src/select-state';
import { augur } from 'services/augurjs';
import { ONE } from 'modules/trade/constants/numbers';

export default function () {
  return selectReportingCycle(store.getState());
}

export const selectReportingCycle = createSelector(
  selectBranchPeriodLength,
  selectBlockchainCurrentBlockTimestamp,
  (periodLength, timestamp) => {
    const currentPeriod = augur.reporting.getCurrentPeriod(periodLength, timestamp);
    const currentPeriodProgress = augur.reporting.getCurrentPeriodProgress(periodLength, timestamp);
    const bnPeriodLength = new BigNumber(periodLength, 10);
    const secondsRemaining = ONE.minus(new BigNumber(currentPeriodProgress, 10).dividedBy(100)).times(bnPeriodLength);
    return {
      currentPeriod,
      currentPeriodProgress,
      reportingCycleTimeRemaining: moment.duration(secondsRemaining, 'seconds').humanize(true)
    };
  }
);
