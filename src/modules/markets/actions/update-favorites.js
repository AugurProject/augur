export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

export function updateFavorites(favorites) {
	return { type: UPDATE_FAVORITES, favorites };
}

export function toggleFavorite(marketID) {
	return { type: TOGGLE_FAVORITE, marketID };
}
