import { createSelector } from 'reselect';
import store from 'src/store';
import selectAllMarkets from 'modules/markets/selectors/markets-all';

export default function () {
  return selectFavoriteMarkets(store.getState());
}

export const selectFavoriteMarkets = createSelector(
  selectAllMarkets,
  markets => markets.filter(market => !!market.isFavorite)
);
