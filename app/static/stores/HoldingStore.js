var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  balance: null
}

var HoldingStore = Fluxxor.createStore({
  initialize: function () {
    this.bindActions(
      constants.holding.LOAD_BALANCE_SUCCESS, this.handleLoadBalanceSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleLoadBalanceSuccess: function (payload) {
    state.balance = payload.balance;
    this.emit(constants.CHANGE_EVENT);
  }
});

module.exports = HoldingStore;
