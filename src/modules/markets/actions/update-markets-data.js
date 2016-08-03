export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';

export function updateMarketsData(marketsData) {
	return { type: UPDATE_MARKETS_DATA, marketsData };
}
