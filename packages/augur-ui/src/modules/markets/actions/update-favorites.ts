import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { Favorite } from "modules/types";

export const UPDATE_FAVORITES = "UPDATE_FAVORITES";
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export const updateFavorites = (favorites: Array<Favorite>) => ({
  type: UPDATE_FAVORITES,
  data: { favorites }
});

const toggleFavoriteAction = (marketId: string, timestamp: number) => ({
  type: TOGGLE_FAVORITE,
  data: { marketId, timestamp }
});

export const toggleFavorite = (marketId: string) => (
  dispatch: Function,
  getState: Function
) => {
  const { blockchain } = getState();
  dispatch(toggleFavoriteAction(marketId, blockchain.currentAugurTimestamp));
};

export const loadFavoritesMarkets = (favorites: Array<Favorite>) => (
  dispatch: Function
) => {
  if (favorites) {
    dispatch(
      loadMarketsInfoIfNotLoaded(Object.keys(favorites), () => {
        dispatch(updateFavorites(favorites));
      })
    );
  }
};
