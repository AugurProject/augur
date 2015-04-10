var constants = require('../constants');

var HoldingActions = {
  loadBalance: function () {
    var contract = this.flux.store('config').getState().contract;
    var account = this.flux.store('network').getAccount();

    var balance = contract.call({from: account}).balance(account).dividedBy( new BigNumber(2).toPower(64) );
    this.dispatch(constants.holding.LOAD_BALANCE_SUCCESS, {balance: balance});
  }
};

module.exports = HoldingActions;
