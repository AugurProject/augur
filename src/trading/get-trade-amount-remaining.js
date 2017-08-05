"use strict";

var rpcInterface = require("../rpc-interface");

// { transactionHash, tradeAmountRemainingEventSignature }
function getTradeAmountRemaining(p, callback) {
  rpcInterface.getTransactionReceipt(p.transactionHash, function (transactionReceipt) {
    var hasTradeAmountRemainingLog = false;
    if (!transactionReceipt || !Array.isArray(transactionReceipt.logs) || !transactionReceipt.logs.length) {
      return callback("logs not found");
    }
    transactionReceipt.logs.forEach(function (log) {
      if (log.topics[0] === p.tradeAmountRemainingEventSignature) {
        hasTradeAmountRemainingLog = true;
        callback(null, log.data);
      }
    });
    if (!hasTradeAmountRemainingLog) callback("trade amount remaining log not found");
  });
}

module.exports = getTradeAmountRemaining;
