import { isZero } from '../../../utils/math';
import { augur } from '../../../services/augurjs';
import { reportingCycle } from '../../branch/selectors/reporting-cycle';
import { updateBranch } from '../../branch/actions/update-branch';
import { checkPeriod } from '../../reports/actions/check-period';
import { updateAssets } from '../../auth/actions/update-assets';
import { claimProceeds } from '../../my-positions/actions/claim-proceeds';

export const syncReporterData = cb => (dispatch, getState) => {
  const callback = cb || (e => e && console.log('syncReporterData:', e));
  const { branch, loginAccount } = getState();
  console.log('***syncReporterData***');
  augur.getPenalizedUpTo(branch.id, loginAccount.address, (penalizedUpTo) => {
    console.log('getPenalizedUpTo:', penalizedUpTo);
    if (!penalizedUpTo || penalizedUpTo.error) {
      return callback(penalizedUpTo || 'could not look up last period penalized');
    }
    dispatch(updateBranch({ lastPeriodPenalized: parseInt(penalizedUpTo, 10) }));
    augur.getFeesCollected(branch.id, loginAccount.address, penalizedUpTo, (feesCollected) => {
      console.log('getFeesCollected:', feesCollected);
      if (!feesCollected || feesCollected.error) {
        return callback(feesCollected || 'could not look up fees collected');
      }
      dispatch(updateBranch({ feesCollected: feesCollected === '1' }));

      // check if period needs to be incremented / penalizeWrong needs to be called
      console.debug('checking period');
      dispatch(checkPeriod(true, e => callback(e)));
    });
  });
};

// Synchronize front-end branch state with blockchain branch state.
export const syncBranch = cb => (dispatch, getState) => {
  const callback = cb || (e => e && console.log('syncBranch:', e));
  console.log('***syncBranch***');
  const { blockchain, branch, loginAccount } = getState();
  if (!branch.periodLength) return callback(null);
  const reportingCycleInfo = reportingCycle(branch.periodLength, blockchain.currentBlockTimestamp);
  const isChangedReportPhase = reportingCycleInfo.isReportRevealPhase !== branch.isReportRevealPhase;
  dispatch(updateBranch({ ...reportingCycleInfo }));
  console.log('syncBranch branch.reportPeriod:', branch.reportPeriod);
  console.log('syncBranch isChangedReportPhase:', isChangedReportPhase);
  if (branch.reportPeriod && (!loginAccount.address || !isChangedReportPhase)) {
    console.debug('early exit');
    return callback(null);
  }
  console.log('syncing branch...');
  augur.getVotePeriod(branch.id, (period) => {
    console.log('getVotePeriod:', period);
    if (!period || period.error) {
      return callback(period || 'could not look up report period');
    }
    const reportPeriod = parseInt(period, 10);
    dispatch(updateBranch({ reportPeriod }));
    augur.getPast24(period, (past24) => {
      console.log('getPast24:', past24);
      if (!past24 || past24.error) {
        return callback(past24 || 'could not look up past 24');
      }
      dispatch(updateBranch({ numEventsCreatedInPast24Hours: parseInt(past24, 10) }));
      augur.getNumberEvents(branch.id, period, (numberEvents) => {
        console.log('getNumberEvents:', numberEvents);
        if (!numberEvents || numberEvents.error) {
          return callback(numberEvents || 'could not look up number of events');
        }
        dispatch(updateBranch({ numEventsInReportPeriod: parseInt(numberEvents, 10) }));
        if (!loginAccount.address) return callback(null);
        dispatch(updateAssets((err, balances) => {
          console.log('updateAssets:', err, balances);
          if (err) return callback(err);
          console.log('claimProceeds');
          dispatch(claimProceeds());
          if (!balances.rep || isZero(balances.rep)) return callback(null);
          dispatch(syncReporterData(callback));
        }));
      });
    });
  });
};
