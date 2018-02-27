import { createSelector } from 'reselect'

export const selectEnvState = state => state.env
export const selectBlockchainState = state => state.blockchain
export const selectUniverseState = state => state.universe
export const selectConnectionState = state => state.connection
export const selectUrlState = state => state.url
export const selectAuthState = state => state.auth
export const selectLoginAccountState = state => state.loginAccount
export const selectAccountNameState = state => state.accountName
export const selectActiveViewState = state => state.activeView
export const selectNewMarketState = state => state.newMarket
export const selectMarketsDataState = state => state.marketsData
export const selectMarketLoadingState = state => state.marketLoading
export const selectHasLoadedMarketsState = state => state.hasLoadedMarkets
export const selectOutcomesDataState = state => state.outcomesData
export const selectFavoritesState = state => state.favorites
export const selectReportsState = state => state.reports
export const selectHasLoadedReportsState = state => state.hasLoadedReports
export const selectSelectedMarketIDState = state => state.selectedMarketId
export const selectSelectedMarketsSubsetState = state => state.selectedMarketsSubset
export const selectSelectedMarketsHeaderState = state => state.selectedMarketsHeader
export const selectTagsState = state => state.tags
export const selectCategoriesState = state => state.categories
export const selectHasLoadedCategoryState = state => state.hasLoadedCategory
export const selectSelectedCategoryState = state => state.selectedCategory
export const selectPriceHistoryState = state => state.priceHistory
export const selectTradesInProgressState = state => state.tradesInProgress
export const selectTradeCommitmentState = state => state.tradeCommitment
export const selectSmallestPositionsState = state => state.smallestPositions
export const selectOrderBooksState = state => state.orderBooks
export const selectOrderCancellationState = state => state.orderCancellation
export const selectAccountTradesState = state => state.accountTrades
export const selectAccountPositionsState = state => state.accountPositions
export const selectTransactionsDataState = state => state.transactionsData
export const selectScalarMarketsShareDenominationState = state => state.scalarMarketsShareDenomination
export const selectClosePositionTradeGroupsState = state => state.closePositionTradeGroups
export const selectMarketCreatorFeesState = state => state.marketCreatorFees
export const selectNotificationsState = state => state.notifications
export const selectMarketReportState = state => state.marketReportState
export const selectParticipationTokens = state => state.participationTokens
export const selectInitialReporters = state => state.initialReporters
export const selectDisputeCrowdsourcerTokens = state => state.disputeCrowdsourcerTokens

export const selectBlockchainCurrentBlockTimestamp = createSelector(
  selectBlockchainState,
  blockchain => blockchain.currentBlockTimestamp
)

export const selectUniverseReportingPeriodDurationInSeconds = createSelector(
  selectUniverseState,
  universe => universe.reportingPeriodDurationInSeconds
)

export const selectUniverseReportPeriod = createSelector(
  selectUniverseState,
  universe => universe.currentReportingWindowAddress
)

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  loginAccount => loginAccount.address
)
