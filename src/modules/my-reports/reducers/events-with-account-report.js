import { UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA } from '../../my-reports/actions/update-events-with-account-report-data';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

const INITIAL_STATE = {
	oldestLoadedPeriod: null,
	events: []
};

export default function (eventsWithAccountReport = INITIAL_STATE, action) {
	switch (action.type) {
	case UPDATE_EVENTS_WITH_ACCOUNT_REPORT_DATA:
		return {
			...eventsWithAccountReport,
			...action.data,
			events: {
				...eventsWithAccountReport.events,
				...action.data.events
			}
		};
	case CLEAR_LOGIN_ACCOUNT:
		return null;
	default:
		return eventsWithAccountReport;
	}
}
