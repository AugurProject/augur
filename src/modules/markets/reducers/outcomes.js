import { UPDATE_OUTCOMES_DATA, UPDATE_OUTCOME_PRICE } from '../actions/markets-actions';

export default function(outcomes = {}, action) {
    switch (action.type) {
        case UPDATE_OUTCOMES_DATA:
            return {
                ...outcomes,
                ...action.outcomesData
            };

        case UPDATE_OUTCOME_PRICE:
        	if (!outcomes || !outcomes[action.marketID] || !outcomes[action.marketID][action.outcomeID]) {
        		return outcomes;
        	}
        	return {
        		...outcomes,
        		[action.marketID]: {
        			...outcomes[action.marketID],
        			[action.outcomeID]: {
        				...outcomes[action.marketID][action.outcomeID],
        				price: action.price
        			}
        		}
        	};

        default:
            return outcomes;
    }
}