#!/usr/bin/env node

var chalk = require("chalk");
var speedomatic = require("speedomatic");
var Augur = require("../src");
var getPrivateKey = require("./dp/lib/get-private-key").getPrivateKey;
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");

function faucetIn(augur, universe, amount, auth, callback) {
  augur.api.Universe.getReputationToken({ tx: { to: universe } }, function (err, reputationToken) {
    if (err) return callback(err);
    if (debugOptions.cannedMarkets) console.log("reputationToken:", reputationToken);
    augur.api.TestNetReputationToken.faucet({
      tx: { to: reputationToken },
      meta: auth,
      _amount: speedomatic.fix(amount, "hex"),
      onSent: function (res) {
        if (debugOptions.cannedMarkets) console.log("faucet sent:", res.hash);
      },
      onSuccess: function (res) {
        if (debugOptions.cannedMarkets) console.log("faucet success:", res.callReturn);
        callback(null);
      },
      onFailed: callback,
    });
  });
}

function repFaucet(augur, amount, auth, callback) {
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  faucetIn(augur, universe, amount, auth, callback);
}

module.exports = repFaucet;

if (require.main === module) {
  // invoked from the command line
  var augur = new Augur();
  augur.rpc.setDebugOptions(debugOptions);
  var keystoreFilePath = process.argv[2];
  augur.connect({ ethereumNode: connectionEndpoints.ethereumNode }, function (err) {
    if (err) return console.error(err);
    console.log(chalk.cyan.dim("networkId:"), chalk.cyan(augur.rpc.getNetworkID()));
    getPrivateKey(keystoreFilePath, function (err, auth) {
      if (err) return console.log("Error: ", err);
      repFaucet(augur, 100000, auth, function (err) {
        if (err) {
          console.log("Error: ", err);
          process.exit(1);
        }
        console.log("Rep Faucet Success");
        process.exit(0);
      });
    });
  });
}
