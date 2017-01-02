import async from 'async';
import { augur } from '../../../services/augurjs';
import { BINARY, CATEGORICAL, SCALAR } from '../../markets/constants/market-types';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateReports } from '../../reports/actions/update-reports';

const revealReportLock = {};

export function revealReports(cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('revealReports:', e));
		const { branch, loginAccount, reports } = getState();
		// Make sure that:
		//  - branch is in the second half of its reporting period
		//  - user is logged in and has Rep
		//  - that this user has committed reports to reveal
		if (branch.isReportRevealPhase && loginAccount.rep && reports) {
			const branchReports = reports[branch.id];
			if (!branchReports) return callback(null);
			const revealableReports = Object.keys(branchReports)
				.filter(eventID => branchReports[eventID].reportHash &&
				branchReports[eventID].reportHash.length && !branchReports[eventID].isRevealed && branchReports[eventID].period === branch.reportPeriod)
				.map((eventID) => {
					const obj = { ...branchReports[eventID], eventID };
					return obj;
				});
			console.log('revealableReports:', revealableReports);
			if (revealableReports && revealableReports.length && loginAccount.address) {
				async.eachSeries(revealableReports, (report, nextReport) => {
					const eventID = report.eventID;
					console.log('revealReportLock:', eventID, revealReportLock[eventID]);
					if (revealReportLock[eventID]) return nextReport();
					revealReportLock[eventID] = true;
					let type;
					if (report.isScalar) {
						type = SCALAR;
					} else if (report.isCategorical) {
						type = CATEGORICAL;
					} else {
						type = BINARY;
					}
					augur.submitReport({
						event: eventID,
						report: report.reportedOutcomeID,
						salt: report.salt,
						ethics: Number(!report.isUnethical),
						minValue: report.minValue,
						maxValue: report.maxValue,
						type,
						isIndeterminate: report.isIndeterminate,
						onSent: r => console.log('submitReport sent:', r),
						onSuccess: (r) => {
							console.log('submitReport success:', r);
							dispatch(updateAssets());
							revealReportLock[eventID] = false;
							dispatch(updateReports({
								[branch.id]: {
									[eventID]: { ...report, isRevealed: true }
								}
							}));
							nextReport();
						},
						onFailed: e => nextReport(e)
					});
				}, e => callback(e));
			}
		}
	};
}
