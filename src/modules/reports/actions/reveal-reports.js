import * as AugurJS from '../../../services/augurjs';
import { updateReports } from '../../reports/actions/update-reports';

export function revealReports() {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, reports } = getState();

		// if we're in the first half of the reporting period
		if (!blockchain.isReportConfirmationPhase || !loginAccount.rep || !reports) {
			return;
		}

		const revealableReports = Object.keys(reports)
			.filter(eventID => reports[eventID].reportHash &&
			reports[eventID].reportHash.length && !reports[eventID].isRevealed)
			.map(eventID => {
				const obj = { ...reports[eventID], eventID };
				return obj;
			});

		if (!revealableReports || !revealableReports.length) {
			return;
		}

		(function process() {
			// if there are more event ids, continue
			function next() {
				if (revealableReports.length) {
					setTimeout(process, 1000);
				}
			}
			const report = revealableReports.pop();
			const event = report.eventID;
			AugurJS.revealReport(
				event,
				report.salt,
				report.reportedOutcome,
				report.isScalar,
				report.isUnethical,
				(err, res) => {
					console.log('revealReport err:', err);
					console.log('revealReport response:', res);
					dispatch(updateReports(res));
					next();
				}
			);
		}());
	};
}

export function sendRevealReport() {
	return (dispatch, getState) => {

	};
}
