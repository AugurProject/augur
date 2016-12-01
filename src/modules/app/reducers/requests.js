import { MARKET_DATA_LOADING } from '../../market/actions/load-full-market';
import { UPDATE_MARKET_DATA_TIMESTAMP } from '../../market/actions/update-market-data-timestamp';

// For tracking (AJAX) requests, whether they are running so UI can display loading indicator
export default (requests = {}, action) => {
	switch (action.type) {
		case MARKET_DATA_LOADING:
			return {
				...requests,
				[MARKET_DATA_LOADING]: {
					...requests[MARKET_DATA_LOADING],
					[action.marketID]: true
				}
			};
		case UPDATE_MARKET_DATA_TIMESTAMP: {
			const newRequests = { ...requests };
			if (newRequests[MARKET_DATA_LOADING] != null) {
				if (newRequests[MARKET_DATA_LOADING][action.marketID] === true) {
					delete newRequests[MARKET_DATA_LOADING][action.marketID];
					return newRequests;
				}
			}
			return requests;
		}
		default:
			return requests;
	}
};
