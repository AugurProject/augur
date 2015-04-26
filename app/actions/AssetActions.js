var constants = require('../libs/constants');

var AssetActions = {

  loadAssets: function () {

    var networkStore = this.flux.store('network');
    var web3 = networkStore.getWeb3();
    var account = networkStore.getAccount();
    
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var cash = ethereumClient.getCashBalance();
    var reputation = ethereumClient.getRepBalance();
    var ether = web3.eth.getBalance(account);
    
    this.dispatch(constants.asset.LOAD_ASSETS_SUCCESS, {
      cash: cash,
      reputation: reputation,
      ether: ether
    });
  }
};

module.exports = AssetActions;
