import { augur } from '../../../services/augurjs';
import { updateBranch } from '../../app/actions/update-branch';
import { loadReports } from '../../reports/actions/load-reports';
import { revealReports } from '../../reports/actions/reveal-reports';
import { collectFees } from '../../reports/actions/collect-fees';
import { loadEventsWithSubmittedReport } from '../../my-reports/actions/load-events-with-submitted-report';

const tracker = {
	feesCollected: false,
	reportsRevealed: false,
	notSoCurrentPeriod: 0
};

export function checkPeriod(cb) {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, branch } = getState();
		if (branch.id && loginAccount.id && loginAccount.rep) {
			const currentPeriod = augur.getCurrentPeriod(branch.periodLength);
			if (currentPeriod > tracker.notSoCurrentPeriod) {
				tracker.feesCollected = false;
				tracker.reportsRevealed = false;
				tracker.notSoCurrentPeriod = currentPeriod;
			}
			augur.checkPeriod(branch.id, branch.periodLength, loginAccount.id, (err, reportPeriod) => {
				if (err) return cb && cb(err);
				dispatch(updateBranch({ reportPeriod }));
				dispatch(loadEventsWithSubmittedReport());
				dispatch(loadReports((err) => {
					if (err) return cb && cb(err);
					if (blockchain.isReportConfirmationPhase) {
						if (!tracker.feesCollected) {
							dispatch(collectFees());
							tracker.feesCollected = true;
						}
						if (!tracker.reportsRevealed) {
							dispatch(revealReports());
							tracker.reportsRevealed = true;
						}
					}
					return cb && cb(null, reportPeriod);
				}));
			});
		}
	};
}
