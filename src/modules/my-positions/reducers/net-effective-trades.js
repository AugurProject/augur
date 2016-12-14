import { UPDATE_NET_EFFECTIVE_TRADES_DATA } from '../../../modules/my-positions/actions/update-account-trades-data';
import { CLEAR_ACCOUNT_TRADES } from '../../../modules/my-positions/actions/clear-account-trades';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (netEffectiveTrades = null, action) {
	switch (action.type) {
		case UPDATE_NET_EFFECTIVE_TRADES_DATA:
			if (action.data) {
				if (action.marketID) {
					return {
						...netEffectiveTrades,
						[action.marketID]: {
							...action.data[action.marketID]
						}
					};
				}
				return {
					...netEffectiveTrades,
					...action.data
				};
			}
			return netEffectiveTrades;

		case CLEAR_LOGIN_ACCOUNT:
			return null;

		case CLEAR_ACCOUNT_TRADES:
			return null;

		default:
			return netEffectiveTrades;
	}
}
