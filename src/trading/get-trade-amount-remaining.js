"use strict";

var eventsAbi = require("../contracts").abi.events;
var rpcInterface = require("../rpc-interface");

// { transactionHash, tradeAmountRemainingEventSignature }
function getTradeAmountRemaining(p, callback) {
  rpcInterface.getTransactionReceipt(p.transactionHash, function (transactionReceipt) {
    var hasTradeAmountRemainingLog = false;
    if (!transactionReceipt || !Array.isArray(transactionReceipt.logs) || !transactionReceipt.logs.length) {
      return callback("logs not found");
    }
    var tradeAmountRemainingSignature = eventsAbi.TradeAmountRemaining.signature;
    transactionReceipt.logs.forEach(function (log) {
      if (log.topics[0] === tradeAmountRemainingSignature) {
        hasTradeAmountRemainingLog = true;
        callback(null, log.data);
      }
    });
    if (!hasTradeAmountRemainingLog) callback("trade amount remaining log not found");
  });
}

module.exports = getTradeAmountRemaining;
