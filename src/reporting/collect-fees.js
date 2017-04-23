"use strict";

var abi = require("augur-abi");
var BigNumber = require("bignumber.js");
var clone = require("clone");
var getCurrentPeriodProgress = require("../reporting/get-current-period-progress");
var rpcInterface = require("../rpc-interface");
var api = require("../api");
var compose = require("../utils/compose");
var isObject = require("../utils/is-object");

// TODO break this apart
function collectFees(branch, sender, periodLength, onSent, onSuccess, onFailed) {
  if (isObject(branch)) {
    sender = branch.sender;
    periodLength = branch.periodLength;
    onSent = branch.onSent;
    onSuccess = branch.onSuccess;
    onFailed = branch.onFailed;
    branch = branch.branch;
  }
  if (getCurrentPeriodProgress(periodLength) < 50) {
    return onFailed({ "-2": "needs to be second half of reporting period to claim rep" });
  }
  api.Branches.getVotePeriod(branch, function (period) {
    api.ConsensusData.getFeesCollected(branch, sender, period - 1, function (feesCollected) {
      var gasPrice;
      if (feesCollected === "1") return onSuccess({callReturn: "2"});
      api.CollectFees.collectFees({
        branch: branch,
        sender: sender,
        tx: {
          value: abi.hex(new BigNumber("500000", 10).times(rpcInterface.getGasPrice()))
        },
        onSent: onSent,
        onSuccess: compose(function (res, callback) {
          if (res && (res.callReturn === "1" || res.callReturn === "2")) {
            return callback(res);
          }
          api.Branches.getVotePeriod(branch, function (period) {
            api.ConsensusData.getFeesCollected(branch, sender, period - 1, function (feesCollected) {
              if (feesCollected !== "1") {
                res.callReturn = "2";
                return callback(res);
              }
              api.ExpiringEvents.getAfterRep(branch, period - 1, sender, function (afterRep) {
                if (parseInt(afterRep, 10) <= 1) {
                  res.callReturn = "2";
                  return callback(res);
                }
                res.callReturn = "1";
                callback(res);
              });
            });
          });
        }, onSuccess),
        onFailed: onFailed
      });
    });
  });
}

module.exports = collectFees;
