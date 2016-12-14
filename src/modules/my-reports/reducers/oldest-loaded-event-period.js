import { UPDATE_OLDEST_LOADED_EVENT_PERIOD } from '../../my-reports/actions/update-oldest-loaded-event-period';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (oldestLoadedEventPeriod = null, action) {
	switch (action.type) {
		case UPDATE_OLDEST_LOADED_EVENT_PERIOD:
			return action.data;
		case CLEAR_LOGIN_ACCOUNT:
			return null;
		default:
			return oldestLoadedEventPeriod;
	}
}
