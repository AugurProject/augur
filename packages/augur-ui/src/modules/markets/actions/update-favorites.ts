
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { Favorite } from 'modules/types';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'appStore';

export const UPDATE_FAVORITES = 'UPDATE_FAVORITES';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

interface UpdateFavoritesInterface {
  type: typeof UPDATE_FAVORITES;
  data: { favorites: Favorite[] };
}

export const updateFavorites = (
  favorites: Favorite[]
): UpdateFavoritesInterface => ({
  type: UPDATE_FAVORITES,
  data: { favorites },
});

interface ToggleFavoriteInterface {
  type: typeof TOGGLE_FAVORITE;
  data: { marketId: string; timestamp: number };
}

const toggleFavoriteAction = (
  marketId: string,
  timestamp: number
): ToggleFavoriteInterface => ({
  type: TOGGLE_FAVORITE,
  data: { marketId, timestamp },
});

export const toggleFavorite = (
  marketId: string
): ThunkAction<void, AppState, void, ToggleFavoriteInterface> => (
  dispatch,
  getState
) => {
  const { blockchain } = getState();
  dispatch(toggleFavoriteAction(marketId, blockchain.currentAugurTimestamp));
};

export const loadFavoritesMarkets = (
  favorites: Favorite[]
): ThunkAction<void, AppState, void, UpdateFavoritesInterface> => dispatch => {
  if (favorites) {
    dispatch(
      loadMarketsInfoIfNotLoaded(Object.keys(favorites), () => {
        dispatch(updateFavorites(favorites));
      })
    );
  }
};
