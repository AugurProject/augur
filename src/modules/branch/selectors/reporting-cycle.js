import moment from 'moment';
import { augur, abi } from '../../../services/augurjs';
import { ONE } from '../../trade/constants/numbers';

export const reportingCycle = (periodLength, timestamp) => {
  const currentPeriod = augur.getCurrentPeriod(periodLength, timestamp);
  const currentPeriodProgress = augur.getCurrentPeriodProgress(periodLength, timestamp);
  const isReportRevealPhase = currentPeriodProgress > 50;
  const bnPeriodLength = abi.bignum(periodLength);
  const secondsRemaining = ONE.minus(abi.bignum(currentPeriodProgress).dividedBy(100)).times(bnPeriodLength);
  let phaseLabel;
  let phaseTimeRemaining;
  if (isReportRevealPhase) {
    phaseLabel = 'Reveal';
    phaseTimeRemaining = moment.duration(secondsRemaining.toNumber(), 'seconds').humanize(true);
  } else {
    phaseLabel = 'Commit';
    phaseTimeRemaining = moment.duration(secondsRemaining.minus(bnPeriodLength.dividedBy(2)).toNumber(), 'seconds').humanize(true);
  }
  return { currentPeriod, currentPeriodProgress, isReportRevealPhase, phaseLabel, phaseTimeRemaining };
};
