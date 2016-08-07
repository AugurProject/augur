import { UPDATE_REPORTS, CLEAR_REPORTS } from '../../reports/actions/update-reports';

/*
Keys are eventID, values can be:
   - { reportHash: null }: user is required to report and has not yet reported
*/
export default function (reports = {}, action) {
	switch (action.type) {
	case UPDATE_REPORTS: {
		const updatedReports = Object.assign({}, reports);
		let branchID;
		for (branchID in action.reports) {
			if (!action.reports.hasOwnProperty(branchID)) continue;
			updatedReports[branchID] = Object.assign({}, reports[branchID], action.reports[branchID]);
		}
		return updatedReports;
	}
	case CLEAR_REPORTS:
		return {};
	default:
		return reports;
	}
}
