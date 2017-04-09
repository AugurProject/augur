"use strict";

var abi = require("augur-abi");
var accountState = require("./state");

var setAccount = function (account) {
  var privateKey = account.privateKey;
  var derivedKey = account.derivedKey;
  if (privateKey && !Buffer.isBuffer(privateKey)) {
    privateKey = Buffer.from(privateKey, "hex");
  }
  if (derivedKey && !Buffer.isBuffer(derivedKey)) {
    derivedKey = Buffer.from(derivedKey, "hex");
  }
  accountState = {
    privateKey: privateKey,
    address: abi.format_address(account.keystore.address),
    keystore: account.keystore,
    derivedKey: derivedKey
  };
};

module.exports = setAccount;
