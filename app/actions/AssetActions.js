var constants = require('../libs/constants');
var utilities = require('../libs/utilities');
var EthereumClient = require('../clients/EthereumClient');

var AssetActions = {

  loadAssets: function () {

    var networkStore = this.flux.store('network');
    var contract = this.flux.store('config').getState().contract;
    var web3 = networkStore.getWeb3();
    var account = networkStore.getAccount();

    var ethereumClient = new EthereumClient(account);

    var balance = ethereumClient.getCashBalance();
    var reputation = ethereumClient.getRepBalance();
    var gas = utilities.formatGas(web3.eth.getBalance(account));
    
    this.dispatch(constants.asset.LOAD_ASSETS_SUCCESS, {
      balance: balance,
      reputation: reputation,
      gas: gas
    });
  }
};

module.exports = AssetActions;
