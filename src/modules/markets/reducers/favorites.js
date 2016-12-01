import { UPDATE_FAVORITES, TOGGLE_FAVORITE } from '../../markets/actions/update-favorites';
import { CLEAR_LOGIN_ACCOUNT } from '../../auth/actions/update-login-account';

export default function (favorites = {}, action) {
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

		case CLEAR_LOGIN_ACCOUNT:
			return {};

		default:
			return favorites;
	}
}
