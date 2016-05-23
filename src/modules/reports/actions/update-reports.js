export const UPDATE_REPORTS = 'UPDATE_REPORTS';
export const CLEAR_REPORTS = 'CLEAR_REPORTS';

export function updateReports(reports) {
	return { type: UPDATE_REPORTS, reports };
}

export function clearReports() {
	return { type: CLEAR_REPORTS };
}
