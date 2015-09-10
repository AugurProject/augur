var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');
var _ = require('lodash');

var state = {
  markets: {},
  marketLoadingIds: null,
  loadingPage: null
};

var MarketStore = Fluxxor.createStore({

  initialize: function () {
    this.bindActions(
      constants.market.LOAD_MARKETS_SUCCESS, this.handleLoadMarketsSuccess,
      constants.market.UPDATE_MARKETS_SUCCESS, this.handleUpdateMarketsSuccess,
      constants.market.UPDATE_MARKET_SUCCESS, this.handleUpdateMarketSuccess,
      constants.market.ADD_PENDING_MARKET_SUCCESS, this.handleAddPendingMarketSuccess,
      constants.market.ADD_MARKET_SUCCESS, this.handleAddMarketSuccess,
      constants.market.DELETE_MARKET_SUCCESS, this.handleDeleteMarketSuccess,
      constants.market.MARKETS_LOADING, this.handleMarketsLoading
    );
  },

  addChangeListener: function (callback) {
    this.on(constants.CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(constants.CHANGE_EVENT, callback);
  },

  marketIsLoaded: function(marketId) {

    var requiredProperties = ["id", "description", "price", "endDate"];
    var loaded = _.intersection(_.keys(state.markets[marketId]), requiredProperties);

    if (loaded.length == requiredProperties.length) {
      return true;
    } else if (state.markets[marketId].invalid) {   // also flag loaded if it's just invalid (ie. no outcomes or price)
      return true;
    } else {
      return false;
    }
  },

  handleMarketsLoading: function(payload) {

    if (payload.marketLoadingIds) state.marketLoadingIds = payload.marketLoadingIds;
    state.loadingPage = payload.loadingPage;
  },

  getState: function () {
    return state;
  },

  getTrendingMarkets: function(number, currentBranch) {

    var nonMatureMarkets = _.reject(state.markets, function(market) {
      return currentBranch && currentBranch.currentPeriod >= market.tradingPeriod;
    });

    var trendingMarkets = _.sortBy(nonMatureMarkets, function(market) {
        return market.traderCount;
    });

    return _.indexBy(_.slice(trendingMarkets.reverse(), 0, number), 'id');
  },

  getMarketsHeld: function() {

    var marketsHeld = _.filter(state.markets, function(market) {
      if (market.traderId != -1 || market.traderId) return true;
    });
    return _.indexBy(marketsHeld, 'id');
  },

  getMarketsByAuthor: function(author) {
    var marketsByAuthor = _.filter(state.markets, {'author': author});
    return _.indexBy(marketsByAuthor, 'id');
  },

  getMarket: function(marketId) {
    return state.markets[marketId];
  },

  handleUpdateMarketsSuccess: function (payload) {
    state.markets = _.merge(state.markets, payload.markets);
    this.emit(constants.CHANGE_EVENT);
  },

  handleLoadMarketsSuccess: function (payload) {
    state.markets = payload.markets;
    this.emit(constants.CHANGE_EVENT);
  },

  handleUpdateMarketSuccess: function (payload) {

    if (state.markets[payload.market.id]) {
      //console.log('market', payload.market.id, 'exists.  updating...');
      var updatedMarket = _.merge(state.markets[payload.market.id], payload.market);
      updatedMarket.loaded = this.marketIsLoaded(payload.market.id);
      state.markets[payload.market.id] = updatedMarket;
      //console.log(updatedMarket);
    } else {
      //console.log('market', payload.market.id, 'not found.  creating...');
      state.markets[payload.market.id] = payload.market;
    }
    this.emit(constants.CHANGE_EVENT);
  },

  handleAddPendingMarketSuccess: function (payload) {
    state.markets[payload.market.id] = payload.market
    this.emit(constants.CHANGE_EVENT);
  },

  handleAddMarketSuccess: function (payload) {

    state.markets[payload.market.id] = payload.market;
    this.emit(constants.CHANGE_EVENT);
  },

  handleDeleteMarketSuccess: function (payload) {

    // delete market if it exists
    if (payload.marketId && state.markets[payload.marketId]) delete state.markets[payload.marketId];
  }

});

module.exports = MarketStore;
