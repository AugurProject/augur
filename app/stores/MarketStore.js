var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');
var _ = require('lodash');

var state = {
  markets: {}
};

var MarketStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.market.LOAD_MARKETS_SUCCESS, this.handleLoadMarketsSuccess,
      constants.market.UPDATE_MARKETS_SUCCESS, this.handleUpdateMarketsSuccess,
      constants.market.UPDATE_MARKET_SUCCESS, this.handleUpdateMarketSuccess,
      constants.market.ADD_PENDING_MARKET_SUCCESS, this.handleAddPendingMarketSuccess,
      constants.market.ADD_MARKET_SUCCESS, this.handleAddMarketSuccess,
      constants.market.DELETE_MARKET_SUCCESS, this.handleDeleteMarketSuccess
    );
  },

  marketIsLoaded: function(market) {

    var requiredProperties = ["id", "authored", "comments", "events", "expired", "traderId", "endDate", "outcomes", "price"]
    var loaded = _.intersection(_.keys(market), requiredProperties);

    return loaded.length == requiredProperties.length;
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

    payload.market.loaded = this.marketIsLoaded(payload.market);
    state.markets[payload.market.id] = _.merge(state.markets[payload.market.id], payload.market);

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
