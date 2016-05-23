export const UPDATED_SELECTED_MARKETS_HEADER = 'UPDATED_SELECTED_MARKETS_HEADER';

export function updateSelectedMarketsHeader(selectedMarketsHeader) {
	return { type: UPDATED_SELECTED_MARKETS_HEADER, selectedMarketsHeader };
}
