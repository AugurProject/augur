import { UPDATE_TRADE_IN_PROGRESS, CLEAR_TRADE_IN_PROGRESS } from '../../trade/actions/update-trades-in-progress';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (tradesInProgress = {}, action) {
	switch (action.type) {
		case UPDATE_TRADE_IN_PROGRESS:
			return {
				...tradesInProgress,
				[action.data.marketID]: {
					...tradesInProgress[action.data.marketID],
					[action.data.outcomeID]: {
						...action.data.details
					}
				}
			};

		case CLEAR_TRADE_IN_PROGRESS:
			return {
				...tradesInProgress,
				[action.marketID]: {}
			};

		case CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return tradesInProgress;
	}
}
