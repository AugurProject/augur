#!/usr/bin/env node

var chalk = require("chalk");
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var Augur = require("../src");
var getPrivateKey = require("./dp/lib/get-private-key").getPrivateKey;
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");

function faucetInAndMigrate(augur, universe, amount, auth, callback) {
  augur.api.Universe.getReputationToken({ tx: { to: universe } }, function (err, reputationToken) {
    if (err) return callback(err);
    if (debugOptions.cannedMarkets) console.log("reputationToken:", reputationToken);
    augur.api.LegacyReputationToken.faucet({
      meta: auth,
      _amount: speedomatic.fix(amount, "hex"),
      onSent: function (res) {
        if (debugOptions.cannedMarkets) console.log("faucet sent:", res.hash);
      },
      onSuccess: function (res) {
        if (debugOptions.cannedMarkets) console.log("faucet success:", res.callReturn);
        augur.api.LegacyReputationToken.approve({
          meta: auth,
          _spender: reputationToken,
          _value: speedomatic.prefixHex(new BigNumber(2, 10).toPower(255).minus(1).toString(16)),
          onSent: function (res) {
            if (debugOptions.cannedMarkets) console.log("approve sent:", res.hash);
          },
          onSuccess: function (res) {
            if (debugOptions.cannedMarkets) console.log("approve success:", res.callReturn);
            augur.api.ReputationToken.migrateFromLegacyReputationToken({
              meta: auth,
              tx: { to: reputationToken },
              onSent: function (res) {
                if (debugOptions.cannedMarkets) console.log("migrateFromLegacyReputationToken sent:", res.hash);
              },
              onSuccess: function (res) {
                if (debugOptions.cannedMarkets) console.log("migrateFromLegacyReputationToken success:", res.callReturn);
                callback(null);
              },
              onFailed: callback,
            });
          },
          onFailed: callback,
        });
      },
      onFailed: callback,
    });
  });
}

function repFaucet(augur, amount, auth, callback) {
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log(chalk.green.dim("universe:"), chalk.green(universe));
  faucetInAndMigrate(augur, universe, amount, auth, callback);
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
