import { createSelector } from 'reselect'
import store from 'src/store'
import selectAllMarkets from 'modules/markets/selectors/markets-all'

export default function () {
  return selectMarketsTotals(store.getState())
}

export const selectMarketsTotals = createSelector(
  selectAllMarkets,
  (allMarkets) => {
    const totals = allMarkets.reduce((p, market) => {
      p.numAll += 1
      if (market.isPendingReport) p.numPendingReports += 1
      if (market.isFavorite) p.numFavorites += 1
      return p
    }, {
      numAll: 0, numFavorites: 0, numPendingReports: 0, numUnpaginated: 0, numFiltered: 0,
    })

    totals.numUnpaginated = allMarkets.length

    return totals
  },
)
