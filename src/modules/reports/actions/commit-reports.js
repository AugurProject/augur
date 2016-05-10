import * as AugurJS from '../../../services/augurjs';
import { isMarketDataPreviousReportPeriod } from '../../../utils/is-market-data-open';

import { BRANCH_ID } from '../../app/constants/network';

import { updateReports } from '../../reports/actions/update-reports';

export function commitReports() {
	return function (dispatch, getState) {
		var { blockchain, loginAccount, reports } = getState(),
			branchID = BRANCH_ID,
			prevPeriod = blockchain.reportPeriod - 1,
			committableReports;

		// if we're in the first half of the reporting period
		if (!blockchain.isReportConfirmationPhase || !loginAccount.rep || !reports) {
			return;
		}

		committableReports = Object.keys(reports)
			.filter(eventID => reports[eventID].reportHash && reports[eventID].reportHash.length && !reports[eventID].isCommitted)
			.map(eventID => { return { ...reports[eventID], eventID }});

		if (!committableReports || !committableReports.length) {
			return;
		}

		(function process() {
			var report = committableReports.pop();

			AugurJS.getEventIndex(prevPeriod, report.eventID, function (eventIndex) {
				if (!eventIndex || eventIndex.error) {
					console.log('ERROR getEventIndex()', eventIndex && eventIndex.error);
					return next();
				}

				AugurJS.submitReport({
					branch: branchID,
		            reportPeriod: prevPeriod,
		            eventIndex: eventIndex,
		            salt: report.salt,
		            report: report.reportedOutcomeID,
		            eventID: report.eventID,
		            ethics: Number(!report.isUnethical),
		            indeterminate: report.isIndeterminate,
		            isScalar: report.isScalar,

		            onSent: (res) => {},

		            onSuccess: (res) => {
		              dispatch(updateReports({ [report.eventID]: { isCommited: true }}));
console.log('------> committed report', res);
		              return next();
		            },

		            onFailed: (err) => {
						console.log('ERROR submitReport()', err);
						return next();
		            }
				});
			});

			// if there are more event ids, continue
			function next() {
				if (committableReports.length) {
					setTimeout(process, 1000);
				}
			}
		})();
	};
}