var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  markets: {}
};

var MarketStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.market.LOAD_MARKETS_SUCCESS, this.handleLoadMarketsSuccess,
      constants.market.ADD_PENDING_MARKET_SUCCESS, this.handleAddPendingMarketSuccess,
      constants.market.ADD_MARKET_SUCCESS, this.handleAddMarketSuccess
    );
  },

  getState: function () {
    return state;
  },

  getMarketsByAuthor: function(author) {
    var marketsByAuthor = _.filter(state.markets, {'author': author});
    return _.indexBy(marketsByAuthor, 'id');
  },

  handleLoadMarketsSuccess: function (payload) {
    state.markets = payload.markets;
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
