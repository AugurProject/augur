export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';
export const CLEAR_MARKETS_DATA = 'CLEAR_MARKETS_DATA';
export const UPDATE_EVENT_MARKETS_MAP = 'UPDATE_EVENT_MARKETS_MAP';

export function updateMarketsData(marketsData) {
	return { type: UPDATE_MARKETS_DATA, marketsData };
}

export function clearMarketsData() {
	return { type: CLEAR_MARKETS_DATA };
}

export function updateEventMarketsMap(eventID, marketIDs) {
	return { type: UPDATE_EVENT_MARKETS_MAP, eventID, marketIDs };
}
