var constants = require('../libs/constants');

var AssetActions = {

  updateAssets: function() {
    
    var ethereumClient = this.flux.store('config').getEthereumClient();
    var currentBranch = this.flux.store('branch').getCurrentBranch();

    ethereumClient.getCashBalance(function(result) {
      this.dispatch(constants.asset.UPDATE_ASSETS, { cash: result });
    }.bind(this));

    ethereumClient.getEtherBalance(function(result) {
      this.dispatch(constants.asset.UPDATE_ASSETS, { ether: result });
    }.bind(this));

    if (currentBranch) {
      ethereumClient.getRepBalance(currentBranch.id, function(result) {
        this.dispatch(constants.asset.UPDATE_ASSETS, { reputation: result });
      }.bind(this));
    }
  }
};

module.exports = AssetActions;