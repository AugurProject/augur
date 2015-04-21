var constants = require('../libs/constants');
var utilities = require('../libs/utilities');

var AssetActions = {

  loadAssets: function () {

    var networkStore = this.flux.store('network');
    var web3 = networkStore.getWeb3();
    var account = networkStore.getAccount();
    
    var ethereumClient = this.flux.store('config').getEthereumClient();
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
