import { augur } from '../../../services/augurjs';
import { updateBranch } from '../../branch/actions/update-branch';
import { loadReports } from '../../reports/actions/load-reports';
import { clearOldReports } from '../../reports/actions/clear-old-reports';
import { revealReports } from '../../reports/actions/reveal-reports';

const tracker = { reportsRevealed: false, notSoCurrentPeriod: 0 };

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
      tracker.reportsRevealed = false;
      tracker.notSoCurrentPeriod = currentPeriod;
      dispatch(clearOldReports());
    }
    augur.reporting.prepareToReport(branch.id, branch.periodLength, loginAccount.address, (err, reportPeriod) => {
      console.log('checkPeriod complete:', err, reportPeriod);
      if (err) return callback(err);
      dispatch(updateBranch({ reportPeriod }));
      dispatch(clearOldReports());
      dispatch(loadReports((err) => {
        if (err) return callback(err);
        if (branch.isReportRevealPhase) {
          if (!tracker.reportsRevealed) {
            tracker.reportsRevealed = true;
            dispatch(revealReports((err) => {
              console.log('revealReports complete:', err);
              if (err) tracker.reportsRevealed = false;
            }));
          }
        }
        callback(null);
      }));
    });
  };
}
