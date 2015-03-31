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
    );
  },

  getState: function () {
    return state;
  },

  handleUpdateAccount: function (payload) {
    state.account = payload.account;
    // TODO: Set balance.
    this.emit(constants.CHANGE_EVENT);
  }
};

module.exports = AccountStore;
