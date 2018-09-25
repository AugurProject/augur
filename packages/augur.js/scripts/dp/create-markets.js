#!/usr/bin/env node
/**
 * Create a handful of canned markets for us to test with.
 */

"use strict";

var chalk = require("chalk");
var Augur = require("../../src");
var createMarkets = require("./lib/create-markets");
var getPrivateKey = require("./lib/get-private-key").getPrivateKey;
var connectionEndpoints = require("../connection-endpoints");
var debugOptions = require("../debug-options");

var keystoreFilePath = process.argv[2];

var augur = new Augur();

augur.rpc.setDebugOptions(debugOptions);

module.exports = createMarkets;

if (require.main === module) {
  getPrivateKey(keystoreFilePath, function (err, auth) {
    if (err) return console.error("getPrivateKey failed:", err);
    augur.connect(connectionEndpoints, function (err) {
      if (err) return console.error("connect failed:", err);
      createMarkets(augur, auth, function (err) {
        if (err) {
          console.error(chalk.red.bold("Canned market creation failed:"), err);
          process.exit(1);
        }
        process.exit();
      });
    });
  });
}
