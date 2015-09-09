var constants = require('../libs/constants');

var AssetActions = {

  updateAssets: function () {
    
    var currentAccount = this.flux.store('config').getAccount();

    if (currentAccount) {
      var self = this;
      var currentBranch = this.flux.store('branch').getCurrentBranch();
      // log("currentBranch:", currentBranch);

      augur.getCashBalance(function (result) {
        self.dispatch(constants.asset.UPDATE_ASSETS, { cash: result });
      });

      augur.rpc.balance(currentAccount, function (result) {
        self.dispatch(constants.asset.UPDATE_ASSETS, { ether: result });
      });

      if (currentBranch) {
        augur.getRepBalance(currentBranch.id, currentAccount, function (result) {
          self.dispatch(constants.asset.UPDATE_ASSETS, { reputation: result });
        });
      }

    } else {

      this.dispatch(constants.asset.UPDATE_ASSETS, { cash: null, rep: null, ether: null });
    }
  }
};

module.exports = AssetActions;