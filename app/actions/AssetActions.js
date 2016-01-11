"use strict";

var abi = require("augur-abi");
var augur = require("augur.js");
var constants = require("../libs/constants");

var AssetActions = {

  updateAssets: function () {
    
    var currentAccount = this.flux.store('config').getAccount();

    if (currentAccount) {
      var self = this;
      var currentBranch = this.flux.store('branch').getCurrentBranch();

      augur.getCashBalance(currentAccount, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, { cash: abi.bignum(result) });
        }
      });

      augur.rpc.balance(currentAccount, null, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, { ether: abi.bignum(result) });
        }
      });

      augur.getRepBalance(currentBranch.id, currentAccount, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, { reputation: abi.bignum(result) });
        }
      });

    } else {

      this.dispatch(constants.asset.UPDATE_ASSETS, { cash: null, rep: null, ether: null });
    }
  }
};

module.exports = AssetActions;