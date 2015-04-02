var constants = require('../constants');

var AccountActions = {
  updateAccount: function (account) {
    this.dispatch(constants.account.UPDATE_ACCOUNT, {account: account});
    this.flux.actions.account.loadBalance();
    this.flux.actions.network.updateNetwork();
  },

  loadBalance: function () {
    var accountState = this.flux.store('account').getState();
    var configState = this.flux.store('config').getState();
    var contract = configState.contract;

    var balance = contract.call().balance(accountState.account);
    this.dispatch(constants.account.LOAD_BALANCE_SUCCESS, {balance: balance});
  }
};

module.exports = AccountActions;
