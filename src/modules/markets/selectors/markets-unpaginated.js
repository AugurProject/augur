import { createSelector } from 'reselect';
import store from 'src/store';
import { selectActiveViewState, selectSelectedMarketsHeaderState } from 'src/select-state';
import selectAllMarkets from 'modules/markets/selectors/markets-all';
import { selectFilteredMarkets } from 'modules/markets/selectors/markets-filtered';
import { selectFavoriteMarkets } from 'modules/markets/selectors/markets-favorite';
import { MY_POSITIONS } from 'modules/app/constants/views';
import { FAVORITES, PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

export default function () {
  return selectUnpaginatedMarkets(store.getState());
}

export const selectUnpaginatedMarkets = createSelector(
  selectAllMarkets,
  selectFilteredMarkets,
  selectFavoriteMarkets,
  selectActiveViewState,
  selectSelectedMarketsHeaderState,
  (allMarkets, filteredMarkets, favoriteMarkets, activeView, selectedMarketsHeader) => {
    if (activeView === MY_POSITIONS) return selectPositions(store.getState());
    if (selectedMarketsHeader === PENDING_REPORTS) return selectPendingReports(store.getState());
    if (selectedMarketsHeader === FAVORITES) return favoriteMarkets;
    return filteredMarkets;
  }
);

export const selectPositions = createSelector(
  selectAllMarkets,
  markets => markets.filter(market => (
    market.positionsSummary && market.positionsSummary.qtyShares.value
  ))
);

export const selectPendingReports = createSelector(
  selectAllMarkets,
  markets => markets.filter(market => !!market.isPendingReport)
);
