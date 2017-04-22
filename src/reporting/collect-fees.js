"use strict";

var BigNumber = require("bignumber.js");
var clone = require("clone");
var abi = require("augur-abi");
var getCurrentPeriodProgress = require("../reporting/get-current-period-progress");
var rpcInterface = require("../rpc-interface");
var api = require("../api");
var compose = require("../utils/compose");
var isObject = require("../utils/is-object");

function collectFees(branch, sender, periodLength, onSent, onSuccess, onFailed) {
  var tx;
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
  tx = clone(store.getState().contractsAPI.functions.CollectFees.collectFees);
  tx.params = [branch, sender];
  api.Branches.getVotePeriod(branch, function (period) {
    api.ConsensusData.getFeesCollected(branch, sender, period - 1, function (feesCollected) {
      var gasPrice;
      if (feesCollected === "1") return onSuccess({callReturn: "2"});
      gasPrice = rpcInterface.getGasPrice();
      tx.gasPrice = gasPrice;
      tx.value = abi.prefix_hex(new BigNumber("500000", 10).times(new BigNumber(gasPrice, 16)).toString(16));
      rpcInterface.transact(tx, onSent, compose(function (res, cb) {
        if (res && (res.callReturn === "1" || res.callReturn === "2")) {
          return cb(res);
        }
        api.Branches.getVotePeriod(branch, function (period) {
          api.ConsensusData.getFeesCollected(branch, sender, period - 1, function (feesCollected) {
            if (feesCollected !== "1") {
              res.callReturn = "2";
              return cb(res);
            }
            api.ExpiringEvents.getAfterRep(branch, period - 1, sender, function (afterRep) {
              if (parseInt(afterRep, 10) <= 1) {
                res.callReturn = "2";
                return cb(res);
              }
              res.callReturn = "1";
              cb(res);
            });
          });
        });
      }, onSuccess), onFailed);
    });
  });
}

module.exports = collectFees;
