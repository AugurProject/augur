import store from 'src/store';

export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

export function updateFavorites(favorites) {
  return { type: UPDATE_FAVORITES, favorites };
}

export function toggleFavorite(marketID) {
  const { favorites } = store.getState();
  const links = require('modules/link/selectors/links');

  if (Object.keys(favorites).length === 1 && favorites[marketID]) {
    links.default().marketsLink.onClick();
  }

  return { type: TOGGLE_FAVORITE, marketID };
}
