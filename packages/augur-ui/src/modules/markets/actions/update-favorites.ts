import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

export const UPDATE_FAVORITES = "UPDATE_FAVORITES";
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export const updateFavorites = (favorites: any) => ({
  type: UPDATE_FAVORITES,
  data: { favorites }
});

const toggleFavoriteAction = (marketId: String, timestamp: Number) => ({
  type: TOGGLE_FAVORITE,
  data: { marketId, timestamp }
});

export const toggleFavorite = (marketId: String) => (
  dispatch: Function,
  getState: Function
) => {
  const { blockchain } = getState();
  dispatch(toggleFavoriteAction(marketId, blockchain.currentAugurTimestamp));
};

export const loadFavoritesMarkets = (favorites: any) => (
  dispatch: Function,
  getState: Function
) => {
  if (favorites) {
    dispatch(
      loadMarketsInfoIfNotLoaded(Object.keys(favorites), () => {
        dispatch(updateFavorites(favorites));
      })
    );
  }
};
