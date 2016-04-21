export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

export function toggleFavorite(marketID) {
	return { type: TOGGLE_FAVORITE, marketID };
}