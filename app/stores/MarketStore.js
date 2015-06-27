var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');
var _ = require('lodash');

var state = {
  markets: {},
  initialMarketIds: null,
  remainingMarketIds: null
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
      constants.market.MARKETS_LOADING, this.handleMarketsLoading,
      constants.market.MARKET_PAGE_LOADED, this.handleMarketPageLoaded
    );
  },

  marketIsLoaded: function(marketId) {

    var requiredProperties = ["id", "description", "comments", "events", "traderId"];
    var loaded = _.intersection(_.keys(state.markets[marketId]), requiredProperties);
 
    return loaded.length == requiredProperties.length;
  },

  handleMarketsLoading: function(payload) {

    state.initialMarketIds = payload.initialMarketIds;
    state.remainingMarketIds = payload.remainingMarketIds;
  },

  handleMarketPageLoaded: function(payload) {

    state.initialMarketIds = null;
  },

  getState: function () {
    return state;
  },

  getMarketsHeld: function() {

    var marketsHeld = _.filter(state.markets, function(market) {
      if ( _.filter(market.outcomes, function(outcome) {  return outcome.sharesHeld.toNumber != 0}) ) return true;
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
      console.log(updatedMarket.toString(16));
      console.log(updatedMarket);
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
    if (payload.marketId && state.markets[marketId]) delete state.markets[payload.marketId];
  }

});

module.exports = MarketStore;
