import { UPDATE_RECENTLY_EXPIRED_EVENTS } from '../../reports/actions/reports-actions';

export default function(recentlyExpiredMarkets = {}, action) {
    switch (action.type) {
        case UPDATE_RECENTLY_EXPIRED_EVENTS:
        	return {
        		...recentlyExpiredMarkets,
	        	...Object.keys(action.recentlyExpiredEvents).reduce((p, eventID) => {
	        		p[action.recentlyExpiredEvents[eventID].marketID] = eventID;
	        		return p;
	        	}, {})
        	};

        default:
            return recentlyExpiredMarkets;
    }
}