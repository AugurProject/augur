"use strict";

var abi = require("augur-abi");
var constants = require("../libs/constants");

module.exports = {

  updateAssets: function () {

    var currentAccount = this.flux.store('config').getAccount();

    if (currentAccount) {
      var self = this;
      var currentBranch = this.flux.store('branch').getCurrentBranch();

      this.flux.augur.getCashBalance(currentAccount, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, { cash: abi.bignum(result) });
        }
      });

      this.flux.augur.rpc.balance(currentAccount, null, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, { ether: abi.bignum(result) });
        }
      });

      this.flux.augur.getRepBalance(currentBranch.id, currentAccount, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, { reputation: abi.bignum(result) });
        }
      });

    } else {

      this.dispatch(constants.asset.UPDATE_ASSETS, { cash: null, reputation: null, ether: null });
    }
  }
};
