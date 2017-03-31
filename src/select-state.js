import { createSelector } from 'reselect';

export const selectEnvState = state => state.env;
export const selectRequestsState = state => state.requests;
export const selectBlockchainState = state => state.blockchain;
export const selectBranchState = state => state.branch;
export const selectConnectionState = state => state.connection;
export const selectUrlState = state => state.url;
export const selectAuthState = state => state.auth;
export const selectLoginAccountState = state => state.loginAccount;
export const selectActiveViewState = state => state.activeView;
export const selectNewMarketState = state => state.newMarket;
export const selectMarketsDataState = state => state.marketsData;
export const selectHasLoadedMarketsState = state => state.hasLoadedMarkets;
export const selectOutcomesDataState = state => state.outcomesData;
export const selectEventMarketsMapState = state => state.eventMarketsMap;
export const selectFavoritesState = state => state.favorites;
export const selectPaginationState = state => state.pagination;
export const selectReportsState = state => state.reports;
export const selectEventsWithAccountReportState = state => state.eventsWithAccountReport;
export const selectSelectedMarketIDState = state => state.selectedMarketID;
export const selectSelectedMarketsSubsetState = state => state.selectedMarketsSubset;
export const selectSelectedMarketsHeaderState = state => state.selectedMarketsHeader;
export const selectKeywordsState = state => state.keywords;
export const selectTopicsState = state => state.topics;
export const selectHasLoadedTopicState = state => state.hasLoadedTopic;
export const selectSelectedTopicState = state => state.selectedTopic;
export const selectSelectedTagsState = state => state.selectedTags;
export const selectSelectedFilterSortState = state => state.selectedFilterSort;
export const selectPriceHistoryState = state => state.priceHistory;
export const selectLoginMessageState = state => state.loginMessage;
export const selectTradesInProgressState = state => state.tradesInProgress;
export const selectTradeCommitLockState = state => state.tradeCommitLock;
export const selectReportCommitLockState = state => state.reportCommitLock;
export const selectTradeCommitmentState = state => state.tradeCommitment;
export const selectSellCompleteSetsLockState = state => state.sellCompleteSetsLock;
export const selectSmallestPositionsState = state => state.smallestPositions;
export const selectOrderBooksState = state => state.orderBooks;
export const selectOrderCancellationState = state => state.orderCancellation;
export const selectMarketTradesState = state => state.marketTrades;
export const selectAccountTradesState = state => state.accountTrades;
export const selectAccountPositionsState = state => state.accountPositions;
export const selectCompleteSetsBoughtState = state => state.completeSetsBought;
export const selectNetEffectiveTradesState = state => state.netEffectiveTrades;
export const selectTransactionsDataState = state => state.transactionsData;
export const selectScalarMarketsShareDenominationState = state => state.scalarMarketsShareDenomination;
export const selectClosePositionTradeGroupsState = state => state.closePositionTradeGroups;
export const selectChatMessagesState = state => state.chatMessages;
export const selectMarketCreatorFeesState = state => state.marketCreatorFees;

export const selectBranchReportPeriod = createSelector(
  selectBranchState,
  branch => branch.reportPeriod
);

export const selectPaginationSelectedPageNum = createSelector(
  selectPaginationState,
  pagination => pagination.selectedPageNum
);

export const selectPaginationNumPerPage = createSelector(
  selectPaginationState,
  pagination => pagination.numPerPage
);

export const selectLoginAccountAddress = createSelector(
  selectLoginAccountState,
  loginAccount => loginAccount.address
);
