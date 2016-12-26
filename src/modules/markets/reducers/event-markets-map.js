import { CLEAR_MARKETS_DATA, UPDATE_EVENT_MARKETS_MAP } from '../../markets/actions/update-markets-data';

export default function (eventMarketsMap = {}, action) {
	switch (action.type) {
		case UPDATE_EVENT_MARKETS_MAP: {
			if (eventMarketsMap[action.eventID]) {
				const isUnique = {};
				return {
					...eventMarketsMap,
					[action.eventID]: (eventMarketsMap[action.eventID].concat(action.marketIDs)).filter(el => (
						isUnique.hasOwnProperty(el) ? false : (isUnique[el] = true))
					)
				};
			}
			return {
				...eventMarketsMap,
				[action.eventID]: action.marketIDs
			};
		}
		case CLEAR_MARKETS_DATA:
			return {};
		default:
			return eventMarketsMap;
	}
}
