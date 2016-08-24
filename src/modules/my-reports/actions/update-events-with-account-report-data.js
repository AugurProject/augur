export const UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA = 'UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA';

export function updateEventsWithAccountReportData(data) {
	return dispatch => {
		dispatch({ type: UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA, data });
	};
}
