"use strict";

var BigNumber = require("bignumber.js");
var eventsAbi = require("../contracts").abi.events;
var ethrpc = require("../rpc-interface");
var parseLogMessage = require("../events/parse-message/parse-log-message");
var convertOnChainAmountToDisplayAmount = require("../utils/convert-on-chain-amount-to-display-amount");

/**
 * @param {Object} p Parameters object.
 * @param {string} p.transactionHash Transaction hash to look up a receipt for.
 * @param {BigNumber} p.startingOnChainAmount Amount remaining in the trade prior to this transaction.
 * @param {BigNumber=} p.tickSize Tick size (for debug logging only).
 * @return {BigNumber} Number of shares remaining.
 */
function getTradeAmountRemaining(p, callback) {
  var tradeOnChainAmountRemaining = p.startingOnChainAmount;
  console.log("getTradeAmountRemaining initial amount remaining:", tradeOnChainAmountRemaining.toFixed(), "ocs", convertOnChainAmountToDisplayAmount(tradeOnChainAmountRemaining, p.tickSize).toFixed(), "shares");
  ethrpc.getTransactionReceipt(p.transactionHash, function (err, transactionReceipt) {
    if (err) return callback(new Error("getTransactionReceipt failed"));
    if (!transactionReceipt) return callback(new Error("transaction receipt not found"));
    if (!Array.isArray(transactionReceipt.logs) || !transactionReceipt.logs.length) {
      return callback(null, tradeOnChainAmountRemaining);
    }
    var orderFilledEventSignature = eventsAbi.Augur.OrderFilled.signature;
    var orderCreatedEventSignature = eventsAbi.Augur.OrderCreated.signature;
    var logs = transactionReceipt.logs;
    for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
      if (logs[i].topics[0] === orderFilledEventSignature) {
        var orderFilledLog = parseLogMessage("Augur", "OrderFilled", logs[i], eventsAbi.Augur.OrderFilled.inputs);
        var onChainAmountFilled = new BigNumber(orderFilledLog.amountFilled, 10);
        tradeOnChainAmountRemaining = tradeOnChainAmountRemaining.minus(onChainAmountFilled);
        console.log("single-log amount filled:", onChainAmountFilled.toFixed(), "ocs", convertOnChainAmountToDisplayAmount(onChainAmountFilled, p.tickSize).toFixed(), "shares");
        console.log("amount remaining after this log:", tradeOnChainAmountRemaining.toFixed(), "ocs", convertOnChainAmountToDisplayAmount(tradeOnChainAmountRemaining, p.tickSize).toFixed(), "shares");
      } else if (logs[i].topics[0] === orderCreatedEventSignature) {
        tradeOnChainAmountRemaining = new BigNumber(0);
      }
    }
    callback(null, tradeOnChainAmountRemaining);
  });
}

module.exports = getTradeAmountRemaining;
