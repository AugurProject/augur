import { UPDATE_COMPLETE_SETS_BOUGHT } from '../../../modules/my-positions/actions/update-account-trades-data';
import { CLEAR_ACCOUNT_TRADES } from '../../../modules/my-positions/actions/clear-account-trades';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (completeSetsBought = {}, action) {
	switch (action.type) {
		case UPDATE_COMPLETE_SETS_BOUGHT:
			if (action.data) {
				if (action.marketID) {
					return {
						...completeSetsBought,
						[action.marketID]: {
							...action.data[action.marketID]
						}
					};
				}
				return {
					...completeSetsBought,
					...action.data
				};
			}
			return completeSetsBought;

		case CLEAR_LOGIN_ACCOUNT:
			return {};

		case CLEAR_ACCOUNT_TRADES:
			return {};

		default:
			return completeSetsBought;
	}
}
