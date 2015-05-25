var constants = require('../libs/constants');

var AssetActions = {

  loadAssets: function () {

    var networkStore = this.flux.store('network');
    var account = networkStore.getAccount();
    
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var cash = ethereumClient.getCashBalance();
    var reputation = ethereumClient.getRepBalance();
    var ether = ethereumClient.getEtherBalance();

    this.dispatch(constants.asset.LOAD_ASSETS_SUCCESS, {
      cash: cash,
      reputation: reputation,
      ether: ether
    });
  }
};

module.exports = AssetActions;
