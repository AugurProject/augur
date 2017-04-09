"use strict";

var abi = require("augur-abi");
var keys = require("keythereum");
var store = require("../store");

var setActiveAccount = function (account) {
  var activeAccount = {};
  var privateKey = account.privateKey;
  var derivedKey = account.derivedKey;
  if (privateKey && !Buffer.isBuffer(privateKey)) {
    privateKey = Buffer.from(privateKey, "hex");
  }
  if (derivedKey && !Buffer.isBuffer(derivedKey)) {
    derivedKey = Buffer.from(derivedKey, "hex");
  }
  activeAccount.privateKey = privateKey;
  activeAccount.address = abi.format_address(keys.privateKeyToAddress(privateKey));
  if (derivedKey) activeAccount.derivedKey = derivedKey;
  if (account.keystore) activeAccount.keystore = account.keystore;
  store.dispatch({type: "SET_ACTIVE_ACCOUNT", account: activeAccount});
};

module.exports = setActiveAccount;
