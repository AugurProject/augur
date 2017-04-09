"use strict";

var keys = require("keythereum");
var abi = require("augur-abi");
var errors = require("ethrpc").errors;
var constants = require("../constants");
var pass = require("../utils/pass");
var isFunction = require("../utils/is-function");
var setActiveAccount = require("./set-active-account");

var importAccount = function (password, keystore, cb) {
  var callback = (isFunction(cb)) ? cb : pass;
  if (!password || password === "") return callback(errors.BAD_CREDENTIALS);
  keys.recover(password, keystore, function (privateKey) {
    var keystoreCrypto;
    if (!privateKey || privateKey.error) return callback(errors.BAD_CREDENTIALS);
    keystoreCrypto = keystore.crypto || keystore.Crypto;
    keys.deriveKey(password, keystoreCrypto.kdfparams.salt, {kdf: constants.KDF}, function (derivedKey) {
      var account;
      if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);
      account = {
        privateKey: privateKey,
        address: abi.format_address(keystore.address),
        keystore: keystore,
        derivedKey: derivedKey
      };
      setActiveAccount(account);
      callback(account);
    });
  });
};

module.exports = importAccount;
