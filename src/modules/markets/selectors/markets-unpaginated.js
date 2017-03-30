import memoize from 'memoizee';

import { MY_POSITIONS } from '../../app/constants/views';
import { FAVORITES, PENDING_REPORTS } from '../../markets/constants/markets-subset';

import store from '../../../store';

export default function () {
  const { activeView, selectedMarketsHeader } = store.getState();
  const { allMarkets, filteredMarkets, favoriteMarkets } = require('../../../selectors');

  return selectUnpaginatedMarkets(
    allMarkets,
    filteredMarkets,
    favoriteMarkets,
    activeView,
    selectedMarketsHeader
  );
}

export const selectPendingReports = memoize(markets =>
  markets.filter(market => !!market.isPendingReport),
  { max: 1 }
);

export const selectPositions = memoize(markets =>
  markets.filter(market => market.positionsSummary && market.positionsSummary.qtyShares.value),
  { max: 1 }
);

export const selectUnpaginatedMarkets = memoize((allMarkets, filteredMarkets, favoriteMarkets, activeView, selectedMarketsHeader) => {
  if (activeView === MY_POSITIONS) {
    return selectPositions(allMarkets);
  }

  if (selectedMarketsHeader === PENDING_REPORTS) {
    return selectPendingReports(allMarkets);
  }

  if (selectedMarketsHeader === FAVORITES) {
    return favoriteMarkets;
  }

  return filteredMarkets;
}, { max: 1 });
