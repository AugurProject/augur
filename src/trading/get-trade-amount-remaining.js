"use strict";

var BigNumber = require("bignumber.js");
var eventsAbi = require("../contracts").abi.events;
var ethrpc = require("../rpc-interface");
var parseLogMessage = require("../events/parse-message/parse-log-message");

function calculateTotalFill(numShares, numTokens, onChainPrice) {
  return new BigNumber(numShares, 10).plus(new BigNumber(numTokens, 10).dividedBy(onChainPrice));
}

/**
 * @param {Object} p Parameters object.
 * @param {string} p.transactionHash Transaction hash to look up a receipt for.
 * @param {BigNumber} p.startingOnChainAmount Amount remaining in the trade prior to this transaction.
 * @param {BigNumber} p.onChainPrice On-chain price.
 * @return {BigNumber} Number of shares remaining.
 */
function getTradeAmountRemaining(p, callback) {
  var tradeOnChainAmountRemaining = p.startingOnChainAmount;
  console.log("on-chain amount remaining:", tradeOnChainAmountRemaining.toFixed());
  ethrpc.getTransactionReceipt(p.transactionHash, function (err, transactionReceipt) {
    if (err) return callback(new Error("getTransactionReceipt failed"));
    if (!transactionReceipt) return callback(new Error("transaction receipt not found"));
    if (!Array.isArray(transactionReceipt.logs) || !transactionReceipt.logs.length) return callback(new Error("logs not found"));
    // console.log("logs:", transactionReceipt.logs);
    var orderFilledEventSignature = eventsAbi.Augur.OrderFilled.signature;
    var orderCreatedEventSignature = eventsAbi.Augur.OrderCreated.signature;
    var logs = transactionReceipt.logs;
    for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
      if (logs[i].topics[0] === orderFilledEventSignature) {
        var orderFilledLog = parseLogMessage("Augur", "OrderFilled", logs[i], eventsAbi.Augur.OrderFilled.inputs);
        var totalFill = calculateTotalFill(orderFilledLog.numCreatorShares, orderFilledLog.numCreatorTokens, p.onChainPrice);
        tradeOnChainAmountRemaining = tradeOnChainAmountRemaining.minus(totalFill);
        console.log("on-chain amount filled:", totalFill.toFixed(), tradeOnChainAmountRemaining.toFixed(), "remaining");
      } else if (logs[i].topics[0] === orderCreatedEventSignature) {
        tradeOnChainAmountRemaining = new BigNumber(0);
      }
    }
    callback(null, tradeOnChainAmountRemaining);
  });
}

module.exports = getTradeAmountRemaining;
