import async from 'async';
import { augur } from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';

export function revealReports() {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, reports, branch } = getState();

		// if we're in the first half of the reporting period
		if (!blockchain.isReportConfirmationPhase || !loginAccount.rep || !reports) {
			return;
		}

		const branchReports = reports[branch.id];
		if (!branchReports) return;
		const revealableReports = Object.keys(branchReports)
			.filter(eventID => branchReports[eventID].reportHash &&
			branchReports[eventID].reportHash.length && !branchReports[eventID].isRevealed)
			.map(eventID => {
				const obj = { ...branchReports[eventID], eventID };
				return obj;
			});
		if (revealableReports && revealableReports.length && loginAccount && loginAccount.id) {
			async.each(revealableReports, (report, nextReport) => {
				augur.submitReport({
					event: report.eventID,
					report: report.reportedOutcomeID,
					salt: report.salt,
					ethics: Number(!report.isUnethical),
					isScalar: report.isScalar,
					isIndeterminate: report.isIndeterminate,
					onSent: (res) => {
						console.log('augur.submitReport sent:', res);
					},
					onSuccess: (res) => {
						console.log('augur.submitReport success:', res);
						dispatch(updateReports({
							[branch.id]: {
								[report.eventID]: { ...report, isRevealed: true }
							}
						}));
						nextReport();
					},
					onFailed: (err) => {
						console.error('augur.submitReport failed:', err);
						nextReport();
					}
				});
			}, (err) => {
				if (err) return console.error('revealReports:', err);
			});
		}
	};
}
