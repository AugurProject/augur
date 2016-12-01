import { UPDATE_LOGIN_ACCOUNT, CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (loginAccount = {}, action) {
	switch (action.type) {
		case UPDATE_LOGIN_ACCOUNT:
			return {
				...loginAccount,
				...action.data || {}
			};

		case CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return loginAccount;
	}
}
