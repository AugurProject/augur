#!/usr/bin/env node

var fs = require("fs");
var keythereum = require("keythereum");
var BigNumber = require("bignumber.js");
var speedomatic = require("speedomatic");
var Augur = require("../src");
var connectionEndpoints = require("./connection-endpoints");
var debugOptions = require("./debug-options");

var keyFilePath = process.argv[2];

function faucetInAndMigrate(augur, universe, auth, callback) {
  augur.api.LegacyReputationToken.faucet({
    meta: auth,
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
          meta: auth,
          _spender: reputationToken,
          _value: speedomatic.prefixHex(new BigNumber(2, 10).toPower(255).minus(1).toString(16)),
          onSent: function (res) {
            console.log("approve sent:", res.hash);
          },
          onSuccess: function (res) {
            console.log("approve success:", res.callReturn);
            augur.api.ReputationToken.migrateFromLegacyReputationToken({
              meta: auth,
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

fs.readFile(keyFilePath, function (err, keystoreJson) {
  if (err) throw err;
  var keystore = JSON.parse(keystoreJson);
  var sender = speedomatic.formatEthereumAddress(keystore.address);
  console.log("sender:", sender);
  keythereum.recover(process.env.ETHEREUM_PASSWORD, keystore, function (privateKey) {
    if (privateKey == null || privateKey.error) throw new Error("private key decryption failed");
    var auth = { address: sender, signer: privateKey, accountType: "privateKey" };
    augur.connect(connectionEndpoints, function (err) {
      if (err) return console.error(err);
      console.log("networkID:", augur.rpc.getNetworkID());
      var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      console.log("universe:", universe);
      faucetInAndMigrate(augur, universe, auth, function (err) {
        if (err) return console.error("faucetInAndMigrate failed:", err);
        process.exit();
      });
    });
  });
});
