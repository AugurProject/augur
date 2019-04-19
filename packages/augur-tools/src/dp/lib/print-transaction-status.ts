import chalk from "chalk";

export function printTransactionStatus(ethrpc, transactionHash, callback) {
  callback = typeof callback === "function" ? callback : () => {
  };
  if (transactionHash == null)
    return callback(new Error("no transaction hash provided"));
  ethrpc.getTransactionReceipt(transactionHash, function(err:Error, receipt) {
    if (err) return callback(err);
    if (receipt == null)
      return callback(new Error("could not get transaction receipt"));

    console.log(
      chalk.cyan("transaction"),
      chalk.green(transactionHash),
      chalk.cyan("status"),
      chalk.yellow(receipt.status),
      chalk.cyan("used"),
      chalk.yellow(parseInt(receipt.gasUsed, 16)),
      chalk.cyan("gas")
    );
    callback(null);
  });
}
