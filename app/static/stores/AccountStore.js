var Fluxxor = require('fluxxor');
var constants = require('../constants');

var state = {
  account: null,
  balance: null
}

var AccountStore = Fluxxor.createStore({
  initialize: {
    this.bindActions(
      constants.account.UPDATE_ACCOUNT, this.handleUpdateAccount,
      constants.account.LOAD_BALANCE_SUCCESS, this.handleLoadBalanceSuccess
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateAccount: function (payload) {
    state.account = payload.account;
    this.emit(constants.CHANGE_EVENT);
  },

  handleLoadBalanceSuccess: function (payload) {
    state.balance = payload.balance;
    this.emit(constants.CHANGE_EVENT);
  }
};

module.exports = AccountStore;
