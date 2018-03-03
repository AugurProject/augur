"use strict";

var BigNumber = require("bignumber.js");
var eventsAbi = require("../contracts").abi.events;
var ethrpc = require("../rpc-interface");
var parseLogMessage = require("../events/parse-message/parse-log-message");

function calculateTotalFill(numShares, numTokens, priceNumTicksRepresentation) {
  return new BigNumber(numShares, 10).plus(new BigNumber(numTokens, 10).dividedBy(new BigNumber(priceNumTicksRepresentation, 16)));
}

/**
 * @param {Object} p Parameters object.
 * @param {string} p.transactionHash Transaction hash to look up a receipt for.
 * @param {string} p.startingOnChainAmount Amount remaining in the trade prior to this transaction (base-16).
 * @param {string} p.priceNumTicksRepresentation Price in its numTicks representation (base-16).
 */
function getTradeAmountRemaining(p, callback) {
  var tradeOnChainAmountRemaining = new BigNumber(p.startingOnChainAmount, 16);
  // console.log("remaining:", tradeOnChainAmountRemaining.toFixed());
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
        var totalFill = calculateTotalFill(orderFilledLog.numCreatorShares, orderFilledLog.numCreatorTokens, p.priceNumTicksRepresentation);
        // console.log("fill:", totalFill.toFixed());
        tradeOnChainAmountRemaining = tradeOnChainAmountRemaining.minus(totalFill);
        // console.log("remaining:", tradeOnChainAmountRemaining.toFixed());
      } else if (logs[i].topics[0] === orderCreatedEventSignature) {
        tradeOnChainAmountRemaining = new BigNumber(0);
      }
    }
    callback(null, tradeOnChainAmountRemaining.toFixed());
  });
}

module.exports = getTradeAmountRemaining;
