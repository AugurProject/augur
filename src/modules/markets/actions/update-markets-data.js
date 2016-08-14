export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';
export const CLEAR_MARKETS_DATA = 'CLEAR_MARKETS_DATA';

export function updateMarketsData(marketsData) {
	return { type: UPDATE_MARKETS_DATA, marketsData };
}

export function clearMarketsData() {
	return { type: CLEAR_MARKETS_DATA };
}
