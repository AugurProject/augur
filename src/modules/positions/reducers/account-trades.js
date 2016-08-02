import { UPDATE_ACCOUNT_TRADES_DATA } from '../../positions/actions/update-account-trades-data';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (accountTrades = null, action) {
	switch (action.type) {
	case UPDATE_ACCOUNT_TRADES_DATA:
		if (action.data) {
			return {
				...accountTrades,
				...action.data
			};
		}
		return accountTrades;

	case CLEAR_LOGIN_ACCOUNT:
		return null;

	default:
		return accountTrades;
	}
}
