"use strict";

var abi = require("augur-abi");
var api = require("../api");
var compose = require("../utils/compose");
var isObject = require("../utils/is-object");

// branch: hash id
// recver: ethereum address of recipient
// value: number -> fixed-point
function sendReputation(branch, recver, value, onSent, onSuccess, onFailed) {
  if (isObject(branch)) {
    recver = branch.recver;
    value = branch.value;
    onSent = branch.onSent;
    onSuccess = branch.onSuccess;
    onFailed = branch.onFailed;
    branch = branch.branch;
  }

  // if callReturn is 0, but account has sufficient Reputation and Rep
  // redistribution is done, then re-invoke sendReputation
  // (penalizationCatchup is being called)
  api.SendReputation.sendReputation({
    branch: branch,
    recver: recver,
    value: abi.fix(value, "hex"),
    onSent: onSent,
    onSuccess: compose(function (result, callback) {
      if (!result || !result.callReturn || parseInt(result.callReturn, 16)) {
        return callback(result);
      }
      api.Reporting.getRepBalance(branch, result.from, function (repBalance) {
        if (!repBalance || repBalance.error) {
          return onFailed(repBalance);
        }
        if (abi.bignum(repBalance).lt(abi.bignum(value))) {
          return onFailed({ error: "0", message: "not enough reputation" });
        }
        api.ConsensusData.getRepRedistributionDone(branch, result.from, function (repRedistributionDone) {
          if (!repRedistributionDone || !parseInt(repRedistributionDone, 16)) {
            return onFailed({ error: "-3", message: "cannot send reputation until redistribution is complete" });
          }
          sendReputation(branch, recver, value, onSent, onSuccess, onFailed);
        });
      });
    }, onSuccess)
  });
}

module.exports = sendReputation;
