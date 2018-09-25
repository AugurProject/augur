"use strict";

var ethrpc = require("../rpc-interface");
var findEventLogsInLogArray = require("../events/find-event-logs-in-log-array");
var isObject = require("../utils/is-object");

function getMarketFromCreateMarketReceipt(transactionHash, callback) {
  ethrpc.getTransactionReceipt(transactionHash, function (err, receipt) {
    if (err) return callback(err);
    if (!isObject(receipt)) {
      console.error("Receipt is not an object:", transactionHash, receipt, isObject(receipt));
      return callback(new Error("Transaction receipt not found for " + transactionHash));
    }
    var marketCreatedLogs = findEventLogsInLogArray("Augur", "MarketCreated", receipt.logs);
    if (marketCreatedLogs == null || !marketCreatedLogs.length || marketCreatedLogs[0] == null || marketCreatedLogs[0].market == null) {
      return callback(new Error("MarketCreated log not found for " + transactionHash));
    }
    callback(null, marketCreatedLogs[0].market);
  });
}

module.exports = getMarketFromCreateMarketReceipt;
