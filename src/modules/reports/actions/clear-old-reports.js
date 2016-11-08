import { updateReports } from '../../reports/actions/update-reports';

export function clearOldReports() {
	return (dispatch, getState) => {
		const { branch, reports } = getState();
		const branchIDs = Object.keys(reports);
		const numBranches = branchIDs.length;
		const reportPeriod = branch.reportPeriod;
		let branchReports;
		let eventIDs;
		let numEventIDs;
		for (let i = 0; i < numBranches; ++i) {
			branchReports = reports[branchIDs[i]];
			eventIDs = Object.keys(branchReports);
			numEventIDs = eventIDs.length;
			for (let j = 0; j < numEventIDs; ++j) {
				if (branchReports[eventIDs[j]].period < reportPeriod) {
					delete branchReports[eventIDs[j]];
				}
			}
		}
		dispatch(updateReports(reports));
	};
}
