"use strict";

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var eventsAbi = require("../contracts").abi.events;
var ethrpc = require("../rpc-interface");
var parseLogMessage = require("../events/parse-message/parse-log-message");

function calculateTotalFill(numShares, numTokens, priceNumTicksRepresentation) {
  return speedomatic.unfix(new BigNumber(numShares, 10).plus(new BigNumber(numTokens, 10).dividedBy(new BigNumber(priceNumTicksRepresentation, 16))));
}

/**
 * @param {Object} p Parameters object.
 * @param {string} p.transactionHash Transaction hash to look up a receipt for.
 * @param {string} p.startingAmount Amount remaining in the trade prior to this transaction (base-10).
 * @param {string} p.priceNumTicksRepresentation Price in its numTicks representation (base-16).
 */
function getTradeAmountRemaining(p, callback) {
  var tradeAmountRemaining = new BigNumber(p.startingAmount, 10);
  ethrpc.getTransactionReceipt(p.transactionHash, function (transactionReceipt) {
    if (!transactionReceipt || transactionReceipt.error || !Array.isArray(transactionReceipt.logs) || !transactionReceipt.logs.length) {
      return callback("logs not found");
    }
    var orderFilledEventSignature = eventsAbi.Augur.OrderFilled.signature;
    var logs = transactionReceipt.logs;
    for (var i = 0, numLogs = logs.length; i < numLogs; ++i) {
      if (logs[i].topics[0] === orderFilledEventSignature) {
        var orderFilledLog = parseLogMessage("Augur", "OrderFilled", logs[i], eventsAbi.Augur.OrderFilled.inputs);
        var totalFill = calculateTotalFill(orderFilledLog.numFillerShares, orderFilledLog.numFillerTokens, p.priceNumTicksRepresentation);
        tradeAmountRemaining = tradeAmountRemaining.minus(totalFill);
      }
    }
    callback(null, tradeAmountRemaining.toFixed());
  });
}

module.exports = getTradeAmountRemaining;
