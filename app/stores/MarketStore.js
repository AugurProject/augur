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
      constants.market.ADD_MARKET_SUCCESS, this.handleAddMarketSuccess
    );
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
    state.market[payload.market.id] = payload.market;
    this.emit(constants.CHANGE_EVENT);
  },

  handleAddPendingMarketSuccess: function (payload) {
    state.markets[payload.market.id] = payload.market
    this.emit(constants.CHANGE_EVENT);
  },

  handleAddMarketSuccess: function (payload) {

    state.markets[payload.market.id] = payload.market;
    delete state.markets[payload.pendingId];
    this.emit(constants.CHANGE_EVENT);
  }

});

module.exports = MarketStore;
