import { UPDATE_FAVORITES, TOGGLE_FAVORITE } from '../../markets/actions/update-favorites';

export default function (favorites = { }, action) {
	let newFavorites;

	switch (action.type) {
	case UPDATE_FAVORITES:
		return {
			...favorites,
			...action.favorites
		};

	case TOGGLE_FAVORITE:
		newFavorites = {
			...favorites
		};
		if (newFavorites[action.marketID]) {
			delete newFavorites[action.marketID];
		} else {
			newFavorites[action.marketID] = Date.now();
		}
		return newFavorites;

	default:
		return favorites;
	}
}
