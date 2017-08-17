import { createSelector } from 'reselect';
import store from 'src/store';
import { selectActiveViewState, selectSelectedMarketsHeaderState } from 'src/select-state';
import selectAllMarkets from 'modules/markets/selectors/markets-all';
import { MY_POSITIONS } from 'modules/app/constants/views';
import { PENDING_REPORTS } from 'modules/markets/constants/markets-subset';

export default function () {
  return selectUnpaginatedMarkets(store.getState());
}

export const selectUnpaginatedMarkets = createSelector(
  selectAllMarkets,
  selectActiveViewState,
  selectSelectedMarketsHeaderState,
  (allMarkets, activeView, selectedMarketsHeader) => {
    if (activeView === MY_POSITIONS) return selectPositions(store.getState());
    if (selectedMarketsHeader === PENDING_REPORTS) return selectPendingReports(store.getState());
    return allMarkets;
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
