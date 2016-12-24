import { MARKET_DATA_LOADING } from '../../market/actions/load-full-market';

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
		default:
			return requests;
	}
};
