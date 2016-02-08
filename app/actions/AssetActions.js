"use strict";

var abi = require("augur-abi");
var constants = require("../libs/constants");

module.exports = {

  updateAssets: function () {
    var account = this.flux.store('config').getAccount();
    if (account) {
      var self = this;
      var branch = this.flux.store('branch').getCurrentBranch();
      this.flux.augur.getCashBalance(account, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, {cash: abi.bignum(result)});
        }
      });
      this.flux.augur.getRepBalance(branch.id, account, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, {reputation: abi.bignum(result)});
        }
      });
      this.flux.augur.rpc.balance(account, null, function (result) {
        if (result && !result.error) {
          self.dispatch(constants.asset.UPDATE_ASSETS, {ether: abi.bignum(result)});
        }
      });
    } else {
      this.dispatch(constants.asset.UPDATE_ASSETS, {cash: null, reputation: null, ether: null});
    }
  },

  loadMeanTradePrices: function () {
    var self = this;
    var account = this.flux.store('config').getAccount();
    if (account) {
      this.flux.augur.getAccountMeanTradePrices(account, function (meanTradePrices) {
        if (meanTradePrices && !meanTradePrices.error) {
          console.debug("loaded mean trade prices");
          self.dispatch(constants.asset.LOAD_MEAN_TRADE_PRICES_SUCCESS, {meanTradePrices});
        }
      });
    }
  }
};
