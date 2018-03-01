import { createSelector } from 'reselect'
import store from 'src/store'
import {
  selectMarketsDataState,
  selectMarketLoadingState,
  selectFavoritesState,
  selectReportsState,
  selectOutcomesDataState,
  selectAccountTradesState,
  selectTradesInProgressState,
  selectUniverseState,
  selectPriceHistoryState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectSmallestPositionsState,
  selectLoginAccountState,
} from 'src/select-state'
import selectAccountPositions from 'modules/user-open-orders/selectors/positions-plus-asks'

import { selectMarket } from 'modules/market/selectors/market'

export default function () {
  return selectMarkets(store.getState())
}

export const selectMarkets = createSelector(
  selectMarketsDataState,
  selectMarketLoadingState,
  selectFavoritesState,
  selectReportsState,
  selectOutcomesDataState,
  selectAccountPositions,
  selectAccountTradesState,
  selectTradesInProgressState,
  selectUniverseState,
  selectPriceHistoryState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectSmallestPositionsState,
  selectLoginAccountState,
  (marketsData, marketLoading, favorites, reports, outcomesData, accountPositions, accountTrades, tradesInProgress, universe, selectedFilterSort, priceHistory, orderBooks, orderCancellation, smallestPositions, loginAccount) => {
    if (!marketsData) return []
    return Object.keys(marketsData).map((marketId) => {
      if (!marketId || !marketsData[marketId]) return {}
      return selectMarket(marketId)
    })
  },
)
