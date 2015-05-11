var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  markets: {},
  pendingMarkets: {}
};

var MarketStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.market.LOAD_MARKETS_SUCCESS, this.handleLoadMarketsSuccess,
      constants.market.ADD_MARKET_SUCCESS, this.handleAddMarketSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadMarketsSuccess: function (payload) {
    state.markets = payload.markets;
    this.emit(constants.CHANGE_EVENT);
  },

  handleAddMarketSuccess: function (payload) {
    state.pendingMarkets[payload.id] = payload.market
    this.emit(constants.CHANGE_EVENT);
  }

});

module.exports = MarketStore;
