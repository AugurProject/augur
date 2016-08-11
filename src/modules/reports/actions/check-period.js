import { augur } from '../../../services/augurjs';
import { UPDATE_BLOCKCHAIN } from '../../app/actions/update-blockchain';
import { loadReports } from '../../reports/actions/load-reports';
import { revealReports } from '../../reports/actions/reveal-reports';
import { collectFees } from '../../reports/actions/collect-fees';

const tracker = {
	feesCollected: false,
	reportsRevealed: false,
	notSoCurrentPeriod: 0
};

export function checkPeriod(cb) {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, branch } = getState();
		console.log('checkPeriod:', branch.id, loginAccount.id, loginAccount.rep);
		if (branch.id && loginAccount.id && loginAccount.rep) {
			const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
			console.log('checkPeriod:', currentPeriod, tracker.notSoCurrentPeriod);
			if (currentPeriod > tracker.notSoCurrentPeriod) {
				tracker.feesCollected = false;
				tracker.reportsRevealed = false;
				tracker.notSoCurrentPeriod = currentPeriod;
			}
			console.log('augur.checkPeriod:', branch.id, branch.periodLength, loginAccount.id);
			augur.checkPeriod(branch.id, branch.periodLength, loginAccount.id, (err, reportPeriod) => {
				console.log('augur.checkPeriod response:', err, reportPeriod);
				if (err) return cb && cb(err);
				dispatch({ type: UPDATE_BLOCKCHAIN, data: { reportPeriod } });
				dispatch(loadReports((err) => {
					if (err) return cb && cb(err);
					console.log('checkPeriod isReportConfirmationPhase:', blockchain.isReportConfirmationPhase);
					if (blockchain.isReportConfirmationPhase) {
						if (!tracker.feesCollected) {
							dispatch(collectFees());
							tracker.feesCollected = true;
						}
						if (!tracker.reportsRevealed) {
							dispatch(revealReports());
							tracker.reportsRevealed = true;
						}
						return cb && cb(null, reportPeriod);
					}
				}));
			});
		}
	};
}
