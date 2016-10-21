import { UPDATE_ACCOUNT_SETTINGS } from '../../auth/actions/update-account-settings';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (settings = {}, action) {
	switch (action.type) {
	case UPDATE_ACCOUNT_SETTINGS:
		return {
			...settings,
			...action.settings
		};
	case CLEAR_LOGIN_ACCOUNT:
		return {};
	default:
		return settings;
	}
}
