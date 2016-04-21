import { UPDATE_TRADE_IN_PROGRESS, CLEAR_TRADE_IN_PROGRESS } from '../../trade/actions/update-trades-in-progress';
import { SHOW_LINK } from '../../link/actions/show-link';
import { PATHS_AUTH } from '../../link/constants/paths';
import { LOGOUT } from '../../auth/constants/auth-types';

export default function(tradesInProgress = {}, action) {
    switch (action.type) {
        case SHOW_LINK:
        	if (PATHS_AUTH[action.parsedURL.pathArray[0]] === LOGOUT) {
        		return {};
        	}
            return tradesInProgress;

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

        default:
            return tradesInProgress;
    }
}