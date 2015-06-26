var constants = require('../libs/constants');

var AssetActions = {

  updateAssets: function() {
    
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBranch = this.flux.store('branch').getCurrentBranch();
    var self = this;

    ethereumClient.getCashBalance(function(result) {
      self.dispatch(constants.asset.UPDATE_ASSETS, { cash: result });
    });

    ethereumClient.getRepBalance(currentBranch.id, function(result) {
      self.dispatch(constants.asset.UPDATE_ASSETS, { reputation: result });
    });

    ethereumClient.getEtherBalance(function(result) {
      self.dispatch(constants.asset.UPDATE_ASSETS, { ether: result });
    });
  }
};

module.exports = AssetActions;