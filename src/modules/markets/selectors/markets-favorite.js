import { createSelector } from 'reselect';
import store from 'src/store';
import { selectMarkets } from '../../markets/selectors/markets-all';

export default function () {
  return selectFavoriteMarkets(store.getState());
}

export const selectFavoriteMarkets = createSelector(
  selectMarkets,
  markets => markets.filter(market => !!market.isFavorite)
);
