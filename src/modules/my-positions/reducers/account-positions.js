import { UPDATE_ACCOUNT_POSITIONS_DATA } from '../../../modules/my-positions/actions/update-account-trades-data';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (accountPositions = null, action) {
	switch (action.type) {
		case UPDATE_ACCOUNT_POSITIONS_DATA:
			if (action.data) {
				if (action.marketID) {
					return {
						...accountPositions,
						[action.marketID]: {
							...action.data[action.marketID]
						}
					};
				}
				return {
					...accountPositions,
					...action.data
				};
			}
			return accountPositions;

		case CLEAR_LOGIN_ACCOUNT:
			return null;

		default:
			return accountPositions;
	}
}
