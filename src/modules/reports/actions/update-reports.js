export const UPDATE_REPORTS = 'UPDATE_REPORTS';
export const CLEAR_REPORTS = 'CLEAR_REPORTS';

export function updateReports(updatedReports) {
	return { type: UPDATE_REPORTS, updatedReports };
}

export function clearReports() {
	return { type: CLEAR_REPORTS };
}
