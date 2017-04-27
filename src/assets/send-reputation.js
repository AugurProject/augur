"use strict";

var assign = require("lodash.assign");
var abi = require("augur-abi");
var api = require("../api");
var compose = require("../utils/compose");

// if callReturn is 0, but account has sufficient Reputation and Rep
// redistribution is done, then re-invoke sendReputation
// (penalizationCatchup is being called)
// { branch, recver, value, onSent, onSuccess, onFailed }
function sendReputation(p) {
  api().SendReputation.sendReputation(assign({}, p, {
    value: abi.fix(p.value, "hex"),
    onSuccess: compose(function (result, callback) {
      if (!result || !result.callReturn || parseInt(result.callReturn, 16)) {
        return callback(result);
      }
      api().Reporting.getRepBalance({
        branch: p.branch,
        address: result.from
      }, function (repBalance) {
        if (!repBalance || repBalance.error) {
          return p.onFailed(repBalance);
        }
        if (abi.bignum(repBalance).lt(abi.bignum(p.value))) {
          return p.onFailed({ error: "0", message: "not enough reputation" });
        }
        api().ConsensusData.getRepRedistributionDone({
          branch: p.branch,
          reporter: result.from
        }, function (repRedistributionDone) {
          if (!repRedistributionDone || !parseInt(repRedistributionDone, 16)) {
            return p.onFailed({
              error: "-3",
              message: "cannot send reputation until redistribution is complete"
            });
          }
          sendReputation(p);
        });
      });
    }, p.onSuccess)
  }));
}

module.exports = sendReputation;
