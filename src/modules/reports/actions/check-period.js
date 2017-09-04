import { augur } from 'services/augurjs';
import { updateBranch } from 'modules/branch/actions/update-branch';
import { loadReports } from 'modules/reports/actions/load-reports';
import { clearOldReports } from 'modules/reports/actions/clear-old-reports';

const tracker = { notSoCurrentPeriod: 0 };

export function checkPeriod(unlock, cb) {
  return (dispatch, getState) => {
    const callback = cb || (e => e && console.log('checkPeriod:', e));
    const { loginAccount, branch } = getState();
    console.log('checkPeriod:', unlock, tracker);
    if (!branch.id || !loginAccount.address || loginAccount.rep === '0') {
      return callback(null);
    }
    const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
    if (unlock || currentPeriod > tracker.notSoCurrentPeriod) {
      tracker.notSoCurrentPeriod = currentPeriod;
      dispatch(clearOldReports());
    }
    augur.reporting.prepareToReport(branch.id, branch.periodLength, loginAccount.address, (err, reportPeriod) => {
      console.log('checkPeriod complete:', err, reportPeriod);
      if (err) return callback(err);
      dispatch(updateBranch({ reportPeriod }));
      dispatch(clearOldReports());
      dispatch(loadReports(callback));
    });
  };
}
