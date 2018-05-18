import { createSelector } from 'reselect'

export const selectAccountDisputes = state => state.accountDisputes
export const selectAccountNameState = state => state.accountName
export const selectAccountPositionsState = state => state.accountPositions
export const selectAccountTradesState = state => state.accountTrades
export const selectActiveViewState = state => state.activeView
export const selectAuthState = state => state.auth
export const selectBlockchainState = state => state.blockchain
export const selectCategoriesState = state => state.categories
export const selectClosePositionTradeGroupsState = state => state.closePositionTradeGroups
export const selectConnectionState = state => state.connection
export const selectDisputeCrowdsourcerTokens = state => state.disputeCrowdsourcerTokens
export const selectEnvState = state => state.env
export const selectFavoritesState = state => state.favorites
export const selectHasLoadedCategoryState = state => state.hasLoadedCategory
export const selectHasLoadedMarketsState = state => state.hasLoadedMarkets
export const selectInitialReporters = state => state.initialReporters
export const selectIsLogged = state => state.isLogged
export const selectIsMobile = state => state.isMobile
export const selectIsAnimating = state => state.isAnimating
export const selectIsMobileSmall = state => state.isMobileSmall
export const selectLoginAccountState = state => state.loginAccount
export const selectMarketCreatorFeesState = state => state.marketCreatorFees
export const selectMarketLoadingState = state => state.marketLoading
export const selectMarketReportState = state => state.marketReportState
export const selectMarketsDataState = state => state.marketsData
export const selectMarketsFilteredSorted = state => state.marketsFilteredSorted
export const selectModal = state => state.modal
export const selectNewMarketState = state => state.newMarket
export const selectNotificationsState = state => state.notifications
export const selectOrderBooksState = state => state.orderBooks
export const selectOrderCancellationState = state => state.orderCancellation
export const selectAllOrders = state => state.allOrders
export const selectOutcomesDataState = state => state.outcomesData
export const selectParticipationTokens = state => state.participationTokens
export const selectPriceHistoryState = state => state.priceHistory
export const selectReportsState = state => state.reports
export const selectScalarMarketsShareDenominationState = state => state.scalarMarketsShareDenomination
export const selectSelectedMarketIDState = state => state.selectedMarketId
export const selectSelectedMarketsHeaderState = state => state.selectedMarketsHeader
export const selectSelectedMarketsSubsetState = state => state.selectedMarketsSubset
export const selectSmallestPositionsState = state => state.smallestPositions
export const selectTagsState = state => state.tags
export const selectTradesInProgressState = state => state.tradesInProgress
export const selectTransactionsDataState = state => state.transactionsData
export const selectUniverseState = state => state.universe
export const selectUrlState = state => state.url

export const selectCurrentTimestamp = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentAugurTimestamp * 1000,
)

export const selectCurrentTimestampInSeconds = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentAugurTimestamp,
)

export const selectBlockchainCurrentBlockTimestamp = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentBlockTimestamp,
)

export const selectUniverseReportingPeriodDurationInSeconds = createSelector(
  selectUniverseState,
  universe => universe.reportingPeriodDurationInSeconds,
)

export const selectUniverseReportPeriod = createSelector(
  selectUniverseState,
  universe => universe.currentReportingWindowAddress,
)

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  loginAccount => loginAccount.address,
)
