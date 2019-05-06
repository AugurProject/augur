import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

export const UPDATE_FAVORITES = "UPDATE_FAVORITES";
export const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

export const updateFavorites = favorites => ({
  type: UPDATE_FAVORITES,
  data: { favorites }
});

const toggleFavoriteAction = (marketId, timestamp) => ({
  type: TOGGLE_FAVORITE,
  data: { marketId, timestamp }
});

export const toggleFavorite = marketId => (dispatch, getState) => {
  const { blockchain } = getState();
  dispatch(toggleFavoriteAction(marketId, blockchain.currentAugurTimestamp));
};

export const loadFavoritesMarkets = favorites => (dispatch, getState) => {
  if (favorites) {
    dispatch(
      loadMarketsInfoIfNotLoaded(Object.keys(favorites), () => {
        dispatch(updateFavorites(favorites));
      })
    );
  }
};
