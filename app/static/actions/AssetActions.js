var constants = require('../constants');
var utilities = require('../utilities');

var AssetActions = {
  loadAssets: function () {
    var configStore = this.flux.store('config')
    var contract = configStore.getState().contract;
    var web3 = configStore.getWeb3();
    var account = this.flux.store('network').getAccount();

    var balance = contract.call({from: account}).balance(account).dividedBy( new BigNumber(2).toPower(64) );
    var gas = utilities.formatGas(web3.eth.getBalance(web3.eth.accounts[0]));
    this.dispatch(constants.asset.LOAD_ASSETS_SUCCESS, {
      balance: balance,
      gas: gas
    });
  }
};

module.exports = AssetActions;
