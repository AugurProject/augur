/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var utils = require("../utilities");

module.exports = {

  sendReputation: function (branch, recver, value, onSent, onSuccess, onFailed) {
    // branch: hash id
    // recver: ethereum address of recipient
    // value: number -> fixed-point
    var self = this;
    if (branch && branch.branch) {
      recver = branch.recver;
      value = branch.value;
      onSent = branch.onSent;
      onSuccess = branch.onSuccess;
      onFailed = branch.onFailed;
      branch = branch.branch;
    }
    var tx = clone(this.tx.SendReputation.sendReputation);
    tx.params = [branch, recver, abi.fix(value, "hex")];

    // if callReturn is 0, but account has sufficient Reputation and Rep
    // redistribution is done, then re-invoke sendReputation
    // (penalizationCatchup is being called)
    var prepare = function (result, cb) {
      if (!result || !result.callReturn || parseInt(result.callReturn, 16)) {
        return cb(result);
      }
      self.getRepBalance(branch, result.from, function (repBalance) {
        if (!repBalance || repBalance.error) {
          return onFailed(repBalance);
        }
        if (abi.bignum(repBalance).lt(abi.bignum(value))) {
          return onFailed({error: "0", message: "not enough reputation"});
        }
        self.getRepRedistributionDone(branch, result.from, function (repRedistributionDone) {
          if (!repRedistributionDone || !parseInt(repRedistributionDone, 16)) {
            return onFailed({error: "-3", message: "cannot send reputation until redistribution is complete"});
          }
          self.sendReputation(branch, recver, value, onSent, onSuccess, onFailed);
        });
      });
    };

    this.transact(tx,
      onSent,
      utils.compose(prepare, onSuccess),
      onFailed);
  }
};
