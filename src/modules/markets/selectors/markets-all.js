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
  selectBranchState,
  selectPriceHistoryState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectSmallestPositionsState,
  selectLoginAccountState
} from 'src/select-state'
import selectAccountPositions from 'modules/user-open-orders/selectors/positions-plus-asks'
import { assembleMarket, selectMarketReport } from 'modules/market/selectors/market'

import { isMarketDataOpen, isMarketDataExpired } from 'utils/is-market-data-open'

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
  selectBranchState,
  selectPriceHistoryState,
  selectOrderBooksState,
  selectOrderCancellationState,
  selectSmallestPositionsState,
  selectLoginAccountState,
  (marketsData, marketLoading, favorites, reports, outcomesData, accountPositions, accountTrades, tradesInProgress, branch, selectedFilterSort, priceHistory, orderBooks, orderCancellation, smallestPositions, loginAccount) => {
    if (!marketsData) return []
    return Object.keys(marketsData).map((marketID) => {
      if (!marketID || !marketsData[marketID]) return {}
      const endDate = new Date((marketsData[marketID].endDate * 1000) || 0)

      return assembleMarket(
        marketID,
        marketsData[marketID],
        marketLoading.indexOf(marketID) !== -1,
        priceHistory[marketID],
        isMarketDataOpen(marketsData[marketID]),
        isMarketDataExpired(marketsData[marketID], new Date().getTime()),

        !!favorites[marketID],
        outcomesData[marketID],

        selectMarketReport(marketID, reports[marketsData[marketID].branchID]),
        (accountPositions || {})[marketID],
        (accountTrades || {})[marketID],
        tradesInProgress[marketID],

        // the reason we pass in the date parts broken up like this, is because date objects are never equal, thereby always triggering re-assembly, never hitting the memoization cache
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        branch && branch.currentReportingWindowAddress,
        orderBooks[marketID],
        orderCancellation,
        (smallestPositions || {})[marketID],
        loginAccount,
        store.dispatch
      )
    })
  }
)
