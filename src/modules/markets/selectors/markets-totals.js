import { createSelector } from 'reselect';
import store from 'src/store';
import selectAllMarkets from '../../markets/selectors/markets-all';
import { selectFilteredMarkets } from '../../markets/selectors/markets-filtered';
import { selectUnpaginatedMarkets } from '../../markets/selectors/markets-unpaginated';
import { selectFavoriteMarkets } from '../../markets/selectors/markets-favorite';

export default function () {
  return selectMarketsTotals(store.getState());
}

export const selectMarketsTotals = createSelector(
  selectAllMarkets,
  selectFilteredMarkets,
  selectUnpaginatedMarkets,
  selectFavoriteMarkets,
  (allMarkets, filteredMarkets, unpaginatedMarkets, favoriteMarkets) => {
    const totals = allMarkets.reduce((p, market) => {
      p.numAll += 1;
      if (market.isPendingReport) {
        p.numPendingReports += 1;
      }
      return p;
    }, { numAll: 0, numFavorites: 0, numPendingReports: 0, numUnpaginated: 0, numFiltered: 0 });
    totals.numUnpaginated = unpaginatedMarkets.length;
    totals.numFiltered = filteredMarkets.length;
    totals.numFavorites = favoriteMarkets.length;
    return totals;
  }
);
