var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  balance: null,
  gas: null
}

var HoldingStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.holding.LOAD_HOLDINGS_SUCCESS, this.handleLoadHoldingsSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadHoldingsSuccess: function (payload) {
    state.balance = payload.balance;
    state.gas = payload.gas;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = HoldingStore;
