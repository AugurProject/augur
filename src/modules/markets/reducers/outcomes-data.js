import { UPDATE_OUTCOMES_DATA } from '../../markets/actions/update-outcomes-data';
import { UPDATE_OUTCOME_PRICE } from '../../markets/actions/update-outcome-price';

export default function (outcomesData = {}, action) {
	switch (action.type) {
	case UPDATE_OUTCOMES_DATA:
		return {
			...outcomesData,
			...action.outcomesData
		};

	case UPDATE_OUTCOME_PRICE:
		if (!outcomesData || !outcomesData[action.marketID] || !outcomesData[action.marketID][action.outcomeID]) {
			return outcomesData;
		}
		return {
			...outcomesData,
			[action.marketID]: {
				...outcomesData[action.marketID],
				[action.outcomeID]: {
					...outcomesData[action.marketID][action.outcomeID],
					price: action.price
				}
			}
		};

	default:
		return outcomesData;
	}
}
