import { UPDATE_REPORTS, CLEAR_REPORTS } from '../../reports/actions/update-reports';

/*
Keys are eventID, values can be:
   - { reportHash: null }: user is required to report and has not yet reported
*/
export default function (reports = {}, action) {
	switch (action.type) {
		case UPDATE_REPORTS: {
			let branchID;
			const updatedReports = Object.assign({}, reports);
			const branchIDs = Object.keys(action.reports);
			const numBranchIDs = branchIDs.length;
			for (let i = 0; i < numBranchIDs; ++i) {
				branchID = branchIDs[i];
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
