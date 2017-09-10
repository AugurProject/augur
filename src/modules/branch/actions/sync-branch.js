import { isZero } from 'utils/math';
import { augur } from 'services/augurjs';
import getReportingCycle from 'modules/branch/selectors/reporting-cycle';
import { updateBranch } from 'modules/branch/actions/update-branch';
import { checkPeriod } from 'modules/reports/actions/check-period';
import { updateAssets } from 'modules/auth/actions/update-assets';
import { claimProceeds } from 'modules/my-positions/actions/claim-proceeds';
import logError from 'utils/log-error';

// Synchronize front-end branch state with blockchain branch state.
export const syncBranch = (callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState();
  if (!branch.periodLength) return callback(null);
  const reportingCycleInfo = getReportingCycle();
  dispatch(updateBranch({ ...reportingCycleInfo }));
  if (branch.reportPeriod && !loginAccount.address) {
    return callback(null);
  }
  console.log('syncing branch...');
  augur.api.Branches.getVotePeriod({ branch: branch.id }, (err, period) => {
    if (err) return callback(err);
    const reportPeriod = parseInt(period, 10);
    dispatch(updateBranch({ reportPeriod }));
    if (!loginAccount.address) return callback(null);
    dispatch(updateAssets((err, balances) => {
      if (err) return callback(err);
      dispatch(claimProceeds());
      if (!balances.rep || isZero(balances.rep)) return callback(null);
      dispatch(syncReporterData(callback));
    }));
  });
};
