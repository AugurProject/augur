var Fluxxor = require('fluxxor');
var constants = require('../libs/constants');

var state = {
  markets: {}
};

var MarketStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.market.LOAD_MARKETS_SUCCESS, this.handleLoadMarketsSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadMarketsSuccess: function (payload) {
    state.markets = payload.markets;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = MarketStore;
