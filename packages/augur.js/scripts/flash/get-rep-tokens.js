var repFaucet = require("../rep-faucet");
var getBalance = require("../dp/lib/get-balances");
var chalk = require("chalk");

function getRepTokens(augur, amount, auth, callback) {
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  getBalance(augur, universe, auth.address, function (err, balances) {
    if (err) {
      console.log(chalk.red(err));
      return callback(JSON.stringify(err));
    }
    if (balances.reputation < parseInt(amount, 10)) {
      repFaucet(augur, amount, auth, function (err) {
        if (err) {
          console.log(chalk.red("Error"), chalk.red(err));
          return callback(err);
        }
        callback(null);
      });
    } else {
      callback(null);
    }
  });
}


module.exports = getRepTokens;
