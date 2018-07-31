import { createSelector } from 'reselect'
import store from 'src/store'
import { selectSelectedMarketsHeaderState } from 'src/select-state'
import { selectMarketsTotals } from 'modules/markets/selectors/markets-totals'

export default function () {
  return selectMarketsHeader(store.getState())
}

export const selectMarketsHeader = createSelector(
  selectSelectedMarketsHeaderState,
  selectMarketsTotals,
  (selectedMarketsHeader, marketsTotals) => ({
    selectedMarketsHeader,
    numMarkets: marketsTotals.numFiltered,
    numFavorites: marketsTotals.numFavorites,
    numPendingReports: marketsTotals.numPendingReports,
  }),
)
