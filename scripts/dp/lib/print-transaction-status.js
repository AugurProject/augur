"use strict";

var chalk = require("chalk");
var debugOptions = require("../../debug-options");
var isFunction = require("../../../src/utils/is-function");
var noop = require("../../../src/utils/noop");

function printTransactionStatus(ethrpc, transactionHash, callback) {
  callback = isFunction(callback) ? callback : noop;
  if (transactionHash == null) return callback(new Error("no transaction hash provided"));
  ethrpc.getTransactionReceipt(transactionHash, function (err, receipt) {
    if (err) return callback(err);
    if (receipt == null) return callback(new Error("could not get transaction receipt"));
    if (debugOptions.cannedMarkets) {
      console.log(chalk.cyan("transaction"), chalk.green(transactionHash), chalk.cyan("status"), chalk.yellow(receipt.status), chalk.cyan("used"), chalk.yellow(parseInt(receipt.gasUsed, 16)), chalk.cyan("gas"));
    }
    callback(null);
  });
}

module.exports = printTransactionStatus;
