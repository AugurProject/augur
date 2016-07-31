import * as AugurJS from '../../../services/augurjs';
// import { isMarketDataPreviousReportPeriod } from '../../../utils/is-market-data-open';

import { BRANCH_ID } from '../../app/constants/network';

import { updateReports } from '../../reports/actions/update-reports';

export function commitReports() {
	return (dispatch, getState) => {
		const { blockchain, loginAccount, reports } = getState();
		const branchID = BRANCH_ID;
		const prevPeriod = blockchain.reportPeriod - 1;

		// if we're in the first half of the reporting period
		if (!blockchain.isReportConfirmationPhase || !loginAccount.rep || !reports) {
			return;
		}

		const committableReports = Object.keys(reports)
			.filter(eventID => reports[eventID].reportHash &&
			reports[eventID].reportHash.length && !reports[eventID].isCommitted)
			.map(eventID => {
				const obj = { ...reports[eventID], eventID };
				return obj;
			});

		if (!committableReports || !committableReports.length) {
			return;
		}

		(function process() {
			// if there are more event ids, continue
			function next() {
				if (committableReports.length) {
					setTimeout(process, 1000);
				}
			}
			const report = committableReports.pop();

			AugurJS.getEventIndex(prevPeriod, report.eventID, (eventIndex) => {
				if (!eventIndex || eventIndex.error) {
					console.log('ERROR getEventIndex()', eventIndex && eventIndex.error);
					return next();
				}

				AugurJS.submitReport({
					branch: branchID,
					reportPeriod: prevPeriod,
					eventIndex,
					salt: report.salt,
					report: report.reportedOutcomeID,
					eventID: report.eventID,
					ethics: Number(!report.isUnethical),
					indeterminate: report.isIndeterminate,
					isScalar: report.isScalar,
					onSent: (res) => {},
					onSuccess: (res) => {
						dispatch(updateReports({ [report.eventID]: { isCommited: true } }));
						console.log('------> committed report', res);
						return next();
					},
					onFailed: (err) => {
						console.log('ERROR submitReport()', err);
						return next();
					}
				});
			});
		}());
	};
}
