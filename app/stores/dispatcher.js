"use strict";

var Fluxxor = require("fluxxor");
var constants = require("../libs/constants");
var stores = {
  asset: require("./AssetStore"),
  branch: require("./BranchStore"),
  config: require("./ConfigStore"),
  market: require("./MarketStore"),
  network: require("./NetworkStore"),
  report: require("./ReportStore"),
  search: require("./SearchStore")
};

stores.asset.initialize = function () {
  this.bindActions(
    constants.asset.UPDATE_ASSETS, this.handleUpdateAssets,
    constants.asset.LOAD_MEAN_TRADE_PRICES_SUCCESS, this.handleLoadMeanTradePricesSuccess
  );
};
stores.branch.initialize = function () {
  this.bindActions(
    constants.branch.LOAD_BRANCHES_SUCCESS, this.handleLoadBranchesSuccess,
    constants.branch.SET_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess,
    constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess,
    constants.branch.CHECK_QUORUM_SENT, this.handleCheckQuorumSent,
    constants.branch.CHECK_QUORUM_SUCCESS, this.handleCheckQuorumSuccess
  );
};
stores.config.initialize = function () {
  this.bindActions(
    constants.config.SET_HOST, this.handleSetHost,
    constants.config.SET_IS_HOSTED, this.handleSetIsHosted,
    constants.config.UPDATE_ACCOUNT, this.handleUpdateAccount,
    constants.config.USER_REGISTERED, this.handleUserRegistered,
    constants.config.USER_SIGNED_OUT, this.handleUserSignedOut,
    constants.config.UPDATE_PERCENT_LOADED_SUCCESS, this.handleUpdatePercentLoadedSuccess,
    constants.config.LOAD_APPLICATION_DATA_SUCCESS, this.handleLoadApplicationDataSuccess,
    constants.config.FILTER_SETUP_COMPLETE, this.handleFilterSetupComplete,
    constants.config.FILTER_TEARDOWN_COMPLETE, this.handleFilterTeardownComplete
  );
};
stores.market.initialize = function () {
  this.bindActions(
    constants.market.LOAD_MARKETS_SUCCESS, this.handleLoadMarketsSuccess,
    constants.market.UPDATE_MARKETS_SUCCESS, this.handleUpdateMarketsSuccess,
    constants.market.UPDATE_MARKET_SUCCESS, this.handleUpdateMarketSuccess,
    constants.market.ADD_PENDING_MARKET_SUCCESS, this.handleAddPendingMarketSuccess,
    constants.market.UPDATE_TOUR_MARKET, this.handleUpdateTourMarket,
    constants.market.ADD_MARKET_SUCCESS, this.handleAddMarketSuccess,
    constants.market.DELETE_MARKET_SUCCESS, this.handleDeleteMarketSuccess,
    constants.market.MARKETS_LOADING, this.handleMarketsLoading,
    constants.market.PRICE_HISTORY_LOADING, this.handlePriceHistoryLoading,
    constants.market.LOAD_PRICE_HISTORY_SUCCESS, this.handleLoadPriceHistorySuccess,
    constants.market.UPDATE_ORDERS_SUCCESS, this.handleUpdateOrdersSuccess,
    constants.market.LOAD_ORDERS_SUCCESS, this.handleLoadOrdersSuccess,
    constants.market.COMMENT_SAVED, this.handleCommentSaved,
    constants.market.CHECK_ORDER_BOOK_SUCCESS, this.handleCheckOrderBookSuccess,
    constants.market.LOAD_METADATA_SUCCESS, this.handleLoadMetadataSuccess,
    constants.market.INITIAL_LOAD_COMPLETE, this.handleInitialLoadComplete,
    constants.market.CLOSED_MARKET, this.handleClosedMarket
  );
};
stores.network.initialize = function () {
  this.bindActions(
    constants.network.UPDATE_NETWORK, this.handleUpdateNetwork,
    constants.network.UPDATE_ETHEREUM_STATUS, this.handleUpdateEthereumStatus,
    constants.network.UPDATE_IS_MONITORING_BLOCKS, this.handleUpdateIsMonitoringBlocks,
    constants.network.UPDATE_BLOCKCHAIN_AGE, this.handleUpdateBlockchainAge
  );
};
stores.report.initialize = function () {
  this.bindActions(
    constants.report.LOAD_EVENTS_TO_REPORT_SUCCESS, this.handleLoadEventsToReportSuccess,
    constants.report.UPDATE_PENDING_REPORTS, this.handleUpdatePendingReports,
    constants.report.READY, this.handleReady,
    constants.config.UPDATE_ACCOUNT, this.handleUpdateAccount,
    constants.branch.UPDATE_CURRENT_BRANCH_SUCCESS, this.handleUpdateCurrentBranchSuccess
  );
};
stores.search.initialize = function () {
  this.bindActions(
    constants.market.LOAD_MARKETS_SUCCESS, this.handleMarketsUpdated,
    constants.market.UPDATE_MARKETS_SUCCESS, this.handleMarketsUpdated,
    constants.search.KEYWORDS_UPDATED, this.handleKeywordsUpdated,
    constants.search.UPDATE_SORT_BY, this.handleUpdateSortBy,
    constants.market.PRICE_HISTORY_LOADING, this.handlePriceHistoryLoading,
    constants.market.LOAD_PRICE_HISTORY_SUCCESS, this.handleLoadPriceHistorySuccess,
    constants.market.LOAD_METADATA_SUCCESS, this.handleLoadMetadataSuccess
  );
};

module.exports = {
    asset: Fluxxor.createStore(stores.asset),
    branch: Fluxxor.createStore(stores.branch),
    config: Fluxxor.createStore(stores.config),
    market: Fluxxor.createStore(stores.market),
    network: Fluxxor.createStore(stores.network),
    report: Fluxxor.createStore(stores.report),
    search: Fluxxor.createStore(stores.search)
};
