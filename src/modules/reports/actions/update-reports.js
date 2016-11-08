export const UPDATE_REPORTS = 'UPDATE_REPORTS';
export const CLEAR_REPORTS = 'CLEAR_REPORTS';

export function updateReport(branchID, eventID, report) {
	return (dispatch, getState) => {
		const branchReports = getState().reports[branchID] || {};
		dispatch(updateReports({
			[branchID]: {
				[eventID]: {
					...(branchReports[eventID] || { eventID }),
					...report
				}
			}
		}));
	};
}

export function updateReports(reports) {
	return { type: UPDATE_REPORTS, reports };
}

export function clearReports() {
	return { type: CLEAR_REPORTS };
}
