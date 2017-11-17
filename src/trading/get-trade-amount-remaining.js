"use strict";

var eventsAbi = require("../contracts").abi.events;
var ethrpc = require("../rpc-interface");

function getTradeAmountRemaining(transactionHash, callback) {
  ethrpc.getTransactionReceipt(transactionHash, function (transactionReceipt) {
    var hasTradeAmountRemainingLog = false;
    if (!transactionReceipt || transactionReceipt.error || !Array.isArray(transactionReceipt.logs) || !transactionReceipt.logs.length) {
      return callback("logs not found");
    }
    var tradeAmountRemainingSignature = eventsAbi.Trade.TradeAmountRemaining.signature;
    for (var i = 0, numLogs = transactionReceipt.logs.length; i < numLogs; ++i) {
      if (transactionReceipt.logs[i].topics[0] === tradeAmountRemainingSignature) {
        hasTradeAmountRemainingLog = true;
        return callback(null, transactionReceipt.logs[i].data);
      }
    }
    if (!hasTradeAmountRemainingLog) callback("trade amount remaining log not found");
  });
}

module.exports = getTradeAmountRemaining;
