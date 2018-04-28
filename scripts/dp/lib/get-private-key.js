"use strict";

var fs = require("fs");
var chalk = require("chalk");
var keythereum = require("keythereum");
var speedomatic = require("speedomatic");
var debugOptions = require("../../debug-options");

function getPrivateKeyFromString(privateKey) {
  privateKey = Buffer.from(speedomatic.strip0xPrefix(privateKey), "hex");
  var address = keythereum.privateKeyToAddress(privateKey);
  if (debugOptions.cannedMarkets) console.log(chalk.green.dim("sender:"), chalk.green(address));
  return { accountType: "privateKey", signer: privateKey, address: address };
}

function getPrivateKeyFromEnv() {
  return getPrivateKeyFromString(process.env.ETHEREUM_PRIVATE_KEY);
}

function getPrivateKeyFromKeystoreFile(keystoreFilePath, callback) {
  fs.readFile(keystoreFilePath, function (err, keystoreJson) {
    if (err) callback(err);
    var keystore = JSON.parse(keystoreJson);
    var address = speedomatic.formatEthereumAddress(keystore.address);
    if (debugOptions.cannedMarkets) console.log(chalk.green.dim("sender:"), chalk.green(address));
    keythereum.recover(process.env.ETHEREUM_PASSWORD, keystore, function (privateKey) {
      if (privateKey == null || privateKey.error) {
        return callback(new Error("private key decryption failed"));
      }
      console.log("private key:", privateKey.toString("hex"));
      callback(null, { accountType: "privateKey", signer: privateKey, address: address });
    });
  });
}

function getPrivateKey(keystoreFilePath, callback) {
  if (process.env.ETHEREUM_PRIVATE_KEY != null) {
    try {
      callback(null, getPrivateKeyFromEnv());
    } catch (exc) {
      callback(exc);
    }
  } else {
    getPrivateKeyFromKeystoreFile(keystoreFilePath, callback);
  }
}

module.exports.getPrivateKey = getPrivateKey;
module.exports.getPrivateKeyFromEnv = getPrivateKeyFromEnv;
module.exports.getPrivateKeyFromString = getPrivateKeyFromString;
