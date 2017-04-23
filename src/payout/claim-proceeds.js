"use strict";

var eventsAPI = require("augur-contracts").api.events;
var rpcInterface = require("../rpc-interface");
var api = require("../api");
var parseLogMessage = require("../filters/parse-message/parse-log-message");
var isObject = require("../utils/is-object");

claimProceeds: function (branch, market, onSent, onSuccess, onFailed) {
  if (isObject(branch)) {
    market = branch.market;
    onSent = branch.onSent;
    onSuccess = branch.onSuccess;
    onFailed = branch.onFailed;
    branch = branch.branch;
  }
  api.CloseMarket.claimProceeds({
    branch: branch,
    market: market,
    onSent: onSent,
    onSuccess: function (res) {
      if (res.callReturn !== "1") return onFailed(res.callReturn);
      rpcInterface.getTransactionReceipt(res.hash, function (receipt) {
        var logs, sig, i, numLogs, inputs;
        if (receipt && Array.isArray(receipt.logs) && receipt.logs.length) {
          logs = receipt.logs;
          sig = eventsAPI.payout.signature;
          inputs = eventsAPI.payout.inputs;
          for (i = 0, numLogs = logs.length; i < numLogs; ++i) {
            if (logs[i].topics[0] === sig) {
              res.callReturn = parseLogMessage("payout", logs[i], inputs);
              break;
            }
          }
        }
        onSuccess(res);
      });
    },
    onFailed: onFailed
  });
}

module.exports = claimProceeds;
