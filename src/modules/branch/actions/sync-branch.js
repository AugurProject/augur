import { isZero } from 'utils/math';
import { augur } from 'services/augurjs';
import getReportingCycle from 'modules/branch/selectors/reporting-cycle';
import { updateBranch } from 'modules/branch/actions/update-branch';
import { checkPeriod } from 'modules/reports/actions/check-period';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { claimProceeds } from 'modules/my-positions/actions/claim-proceeds';

let checkPeriodLock = false;

export const syncReporterData = cb => (dispatch, getState) => {
  const callback = cb || (e => e && console.log('syncReporterData:', e));
  const { branch, loginAccount } = getState();
  augur.getPenalizedUpTo(branch.id, loginAccount.address, (penalizedUpTo) => {
    if (!penalizedUpTo || penalizedUpTo.error) {
      return callback(penalizedUpTo || 'could not look up last period penalized');
    }
    dispatch(updateBranch({ lastPeriodPenalized: parseInt(penalizedUpTo, 10) }));
    augur.getFeesCollected(branch.id, loginAccount.address, penalizedUpTo, (feesCollected) => {
      if (!feesCollected || feesCollected.error) {
        return callback(feesCollected || 'could not look up fees collected');
      }
      dispatch(updateBranch({ feesCollected: feesCollected === '1' }));

      // check if period needs to be incremented / penalizeWrong needs to be called
      if (!checkPeriodLock) {
        checkPeriodLock = true;
        dispatch(checkPeriod(true, (e) => {
          checkPeriodLock = false;
          callback(e);
        }));
      }
    });
  });
};

// Synchronize front-end branch state with blockchain branch state.
export const syncBranch = cb => (dispatch, getState) => {
  const callback = cb || (e => e && console.log('syncBranch:', e));
  const { branch, loginAccount } = getState();
  if (!branch.periodLength) return callback(null);
  const reportingCycleInfo = getReportingCycle();
  const isChangedReportPhase = reportingCycleInfo.isReportRevealPhase !== branch.isReportRevealPhase;
  dispatch(updateBranch({ ...reportingCycleInfo }));
  if (branch.reportPeriod && (!loginAccount.address || !isChangedReportPhase)) {
    return callback(null);
  }
  console.log('syncing branch...');
  augur.getVotePeriod(branch.id, (period) => {
    if (!period || period.error) {
      return callback(period || 'could not look up report period');
    }
    const reportPeriod = parseInt(period, 10);
    dispatch(updateBranch({ reportPeriod }));
    augur.getPast24(period, (past24) => {
      if (!past24 || past24.error) {
        return callback(past24 || 'could not look up past 24');
      }
      dispatch(updateBranch({ numEventsCreatedInPast24Hours: parseInt(past24, 10) }));
      augur.getNumberEvents(branch.id, period, (numberEvents) => {
        if (!numberEvents || numberEvents.error) {
          return callback(numberEvents || 'could not look up number of events');
        }
        dispatch(updateBranch({ numEventsInReportPeriod: parseInt(numberEvents, 10) }));
        if (!loginAccount.address) return callback(null);
        dispatch(updateAssets((err, balances) => {
          if (err) return callback(err);
          dispatch(claimProceeds());
          if (!balances.rep || isZero(balances.rep)) return callback(null);
          dispatch(syncReporterData(callback));
        }));
      });
    });
  });
};
