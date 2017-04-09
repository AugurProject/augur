"use strict";

var keys = require("keythereum");
var clone = require("clone");
var abi = require("augur-abi");
var errors = require("ethrpc").errors;
var constants = require("./constants");
var pass = require("./utils/pass");
var isFunction = require("./utils/is-function");
var accountState = require("./state");

var importAccount = function (password, keystore, cb) {
  var callback;
  callback = (isFunction(cb)) ? cb : pass;
  if (!password || password === "") return callback(errors.BAD_CREDENTIALS);
  keys.recover(password, keystore, function (privateKey) {
    var keystoreCrypto;
    if (!privateKey || privateKey.error) return callback(errors.BAD_CREDENTIALS);
    keystoreCrypto = keystore.crypto || keystore.Crypto;
    keys.deriveKey(password, keystoreCrypto.kdfparams.salt, {kdf: constants.KDF}, function (derivedKey) {
      accountState = {
        privateKey: privateKey,
        address: abi.format_address(keystore.address),
        keystore: keystore,
        derivedKey: derivedKey
      };
      return callback(clone(accountState));
    });
  });
};

module.exports = importAccount;
