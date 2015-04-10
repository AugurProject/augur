var constants = require('../constants');

var AccountActions = {
  loadBalance: function () {
    var contract = this.flux.store('config').getState().contract;
    var account = this.flux.store('network').getAccount();

    var balance = contract.call({from: account}).balance(account).dividedBy( new BigNumber(2).toPower(64) );
    this.dispatch(constants.account.LOAD_BALANCE_SUCCESS, {balance: balance});
  }
};

module.exports = AccountActions;
