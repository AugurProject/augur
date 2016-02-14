"use strict";

var _ = require("lodash");
var constants = require("../libs/constants");

module.exports = {
  state: {
    markets: {},
    authoredMarkets: {},
    pendingMarkets: {},
    orders: {},
    marketLoadingIds: null,
    loadingPage: null,
    marketsPerPage: constants.MARKETS_PER_PAGE,
    orderBookChecked: null
  },
  getState: function () {
    return this.state;
  },
  getMarketsPerPage: function () {
    return this.state.marketsPerPage;
  },
  getPriceHistoryStatus: function (marketId) {
    var market = this.state.markets[marketId];
    if (!market) return null;
    return market.priceHistoryStatus;
  },
  getTrendingMarkets: function (number, currentBranch) {
    var nonMatureMarkets = _.reject(this.state.markets, function (market) {
      return currentBranch && currentBranch.currentPeriod >= market.tradingPeriod;
    });
    var trendingMarkets = _.sortBy(nonMatureMarkets, function (market) {
        return market.traderCount;
    });
    return _.indexBy(_.slice(trendingMarkets.reverse(), 0, number), 'id');
  },
  getMarketsHeld: function () {
    var marketsHeld = _.filter(this.state.markets, function (market) {
      if (market.traderId != -1 || market.traderId) return true;
    });
    return _.indexBy(marketsHeld, 'id');
  },
  getMarketsByAuthor: function (author) {
    var marketsByAuthor = _.filter(this.state.markets, {'author': author});
    return _.indexBy(marketsByAuthor, 'id');
  },
  getAuthoredMarkets: function () {
    return this.state.authoredMarkets;
  },
  getMarket: function (marketId) {
    return this.state.markets[marketId];
  },
  getOrders: function () {
    return this.state.orders;
  },
  handleMarketsLoading: function (payload) {
    if (payload.marketLoadingIds) this.state.marketLoadingIds = payload.marketLoadingIds;
    this.state.loadingPage = payload.loadingPage;
  },
  handleUpdateMarketsSuccess: function (payload) {
    this.state.markets = _.merge(this.state.markets, payload.markets);
    this.emit(constants.CHANGE_EVENT);
  },
  handleLoadMarketsSuccess: function (payload) {
    this.state.markets = payload.markets;
    if (payload.percentLoaded === undefined || payload.percentLoaded === 100) {
      var filtered = _.filter(this.state.markets, {"author": payload.account});
      this.state.authoredMarkets = _.indexBy(filtered, "id");
    }
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateMarketSuccess: function (payload) {
    if (this.state.markets[payload.market.id]) {
      var updatedMarket = _.merge(this.state.markets[payload.market.id], payload.market);
      updatedMarket.loaded = this.marketIsLoaded(payload.market.id);
      this.state.markets[payload.market.id] = updatedMarket;
    } else {
      this.state.markets[payload.market.id] = payload.market;
    }
    this.emit(constants.CHANGE_EVENT);
  },
  handleAddPendingMarketSuccess: function (payload) {
    this.state.pendingMarkets[payload.market.id] = payload.market;
    this.emit(constants.CHANGE_EVENT);
  },
  handleAddMarketSuccess: function (payload) {
    this.state.markets[payload.market.id] = payload.market;
    this.emit(constants.CHANGE_EVENT);
  },
  handleDeleteMarketSuccess: function (payload) {
    // delete (pending) market if it exists
    if (payload.marketId && this.state.pendingMarkets[payload.marketId]) {
      delete this.state.pendingMarkets[payload.marketId];
    }
  },
  handlePriceHistoryLoading: function (payload) {
    this.state.markets[payload.marketId].priceHistoryStatus = "loading";
  },
  handleLoadPriceHistorySuccess: function (payload) {
    this.state.markets[payload.market.id].priceHistory = payload.priceHistory;
    this.state.markets[payload.market.id].priceHistoryStatus = "complete";
    this.emit(constants.CHANGE_EVENT);
  },
  handleUpdateOrdersSuccess: function (payload) {
    this.state.orders = payload.orders;
    this.emit(constants.CHANGE_EVENT);
  },
  handleLoadOrdersSuccess: function (payload) {
    this.state.orders = payload.orders;
    this.emit(constants.CHANGE_EVENT);
  },
  handleCommentSaved: function () {
    this.emit(constants.CHANGE_EVENT);
  },
  handleCheckOrderBookSuccess: function (payload) {
    this.state.orderBookChecked = true;
    this.emit(constants.CHANGE_EVENT);
  },
  marketIsLoaded: function (marketId) {
    var requiredProperties = ["id", "description", "price", "endDate"];
    var loaded = _.intersection(_.keys(this.state.markets[marketId]), requiredProperties);
    if (loaded.length == requiredProperties.length) {
      return true;
    // also flag loaded if it's just invalid (ie. no outcomes or price)
    } else if (this.state.markets[marketId].invalid) {
      return true;
    } else {
      return false;
    }
  }
};
