#!/usr/bin/env node

"use strict";

var fs = require("fs");
var keythereum = require("keythereum");
var speedomatic = require("speedomatic");
var Augur = require("../../src");
var approveAugurEternalApprovalValue = require("./lib/approve-augur-eternal-approval-value");
var fillBothOrderTypes = require("./lib/fill-both-order-types");
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var outcomeToTrade = 0;
var sharesToTrade = "1";

var augur = new Augur();

var keyFilePath = process.argv[2];

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
      var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
      var fillerAddress = sender;
      approveAugurEternalApprovalValue(augur, fillerAddress, auth, function (err) {
        if (err) return console.error(err);
        fillBothOrderTypes(augur, universe, fillerAddress, outcomeToTrade, sharesToTrade, auth, function (err) {
          if (err) console.error("fillBothOrderTypes failed:", err);
          process.exit();
        });
      });
    });
  });
});
