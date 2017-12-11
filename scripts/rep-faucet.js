#!/usr/bin/env node

var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var Augur = require("../src");
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");

function faucetInAndMigrate(augur, universe, callback) {
  augur.api.LegacyReputationToken.faucet({
    _amount: speedomatic.fix(100000, "hex"),
    onSent: function (res) {
      console.log("faucet sent:", res.hash);
    },
    onSuccess: function (res) {
      console.log("faucet success:", res.callReturn);
      augur.api.Universe.getReputationToken({ tx: { to: universe } }, function (err, reputationToken) {
        if (err) return callback(err);
        console.log("reputationToken:", reputationToken);
        augur.api.LegacyReputationToken.approve({
          _spender: reputationToken,
          _value: speedomatic.prefixHex(new BigNumber(2, 10).toPower(255).minus(1).toString(16)),
          onSent: function (res) {
            console.log("approve sent:", res.hash);
          },
          onSuccess: function (res) {
            console.log("approve success:", res.callReturn);
            augur.api.ReputationToken.migrateFromLegacyReputationToken({
              tx: { to: reputationToken },
              onSent: function (res) {
                console.log("migrateFromLegacyReputationToken sent:", res.hash);
              },
              onSuccess: function (res) {
                console.log("migrateFromLegacyReputationToken success:", res.callReturn);
                callback(null);
              },
              onFailed: callback,
            });
          },
          onFailed: callback,
        });
      });
    },
    onFailed: callback,
  });
}

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

augur.connect(connectionEndpoints, function (err) {
  if (err) return console.error(err);
  console.log("networkID:", augur.rpc.getNetworkID());
  var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
  console.log("universe:", universe);
  faucetInAndMigrate(augur, universe, function (err) {
    if (err) return console.error("faucetInAndMigrate failed:", err);
    process.exit();
  });
});
