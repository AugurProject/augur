import { augur } from '../../../services/augurjs';
import { updateBranch } from '../../app/actions/update-branch';
import { loadReports } from '../../reports/actions/load-reports';
import { clearOldReports } from '../../reports/actions/clear-old-reports';
import { revealReports } from '../../reports/actions/reveal-reports';
import { loadEventsWithSubmittedReport } from '../../my-reports/actions/load-events-with-submitted-report';

const tracker = {
	checkPeriodLock: false,
	reportsRevealed: false,
	notSoCurrentPeriod: 0
};

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
			tracker.checkPeriodLock = false;
			dispatch(clearOldReports());
		}
		if (tracker.checkPeriodLock) return callback(null);
		tracker.checkPeriodLock = true;
		augur.checkPeriod(branch.id, branch.periodLength, loginAccount.address, (err, reportPeriod) => {
			console.log('checkPeriod complete:', err, reportPeriod);
			if (err) {
				tracker.checkPeriodLock = false;
				return callback(err);
			}
			dispatch(updateBranch({ reportPeriod }));
			dispatch(loadEventsWithSubmittedReport());
			dispatch(clearOldReports());
			dispatch(loadReports((err) => {
				if (err) {
					tracker.checkPeriodLock = false;
					return callback(err);
				}
				if (branch.isReportRevealPhase) {
					if (!tracker.reportsRevealed) {
						tracker.reportsRevealed = true;
						dispatch(revealReports((err) => {
							console.log('revealReports complete:', err);
							if (err) {
								tracker.reportsRevealed = false;
								tracker.checkPeriodLock = false;
							}
						}));
					}
				} else {
					tracker.checkPeriodLock = false;
				}
				callback(null);
			}));
		});
	};
}
