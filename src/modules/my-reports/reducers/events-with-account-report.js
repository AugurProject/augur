import { UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA } from '../../my-reports/actions/update-events-with-account-report-data';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (eventsWithAccountReport = {}, action) {
	switch (action.type) {
		case UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA: {
			const updatedEvents = Object.keys(action.data).reduce((p, eventID) => {
				p[eventID] = { ...eventsWithAccountReport[eventID], ...action.data[eventID] };
				return p;
			}, {});

			return {
				...eventsWithAccountReport,
				...updatedEvents
			};
		}
		case CLEAR_LOGIN_ACCOUNT:
			return {};
		default:
			return eventsWithAccountReport;
	}
}
