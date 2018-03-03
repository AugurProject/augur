"use strict";

var chalk = require("chalk");

function printTransactionStatus(ethrpc, transactionHash) {
  if (transactionHash != null) {
    ethrpc.getTransactionReceipt(transactionHash, function (err, receipt) {
      if (err || !receipt) {
        console.error(chalk.red("could not get receipt for transaction"), chalk.red.bold(transactionHash));
      } else {
        console.log(chalk.green.dim("transaction"), chalk.green(transactionHash), chalk.cyan.dim("status"), chalk.cyan(receipt.status));
      }
    });
  }
}

module.exports = printTransactionStatus;
