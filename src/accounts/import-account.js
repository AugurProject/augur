"use strict";

var abi = require("augur-abi");
var keythereum = require("keythereum");
var errors = require("../rpc-interface").errors;
var pass = require("../utils/pass");
var isFunction = require("../utils/is-function");
var KDF = require("../constants").KDF;

function importAccount(password, keystore, cb) {
  var callback = (isFunction(cb)) ? cb : pass;
  if (!password || password === "") return callback(errors.BAD_CREDENTIALS);
  keythereum.recover(password, keystore, function (privateKey) {
    var keystoreCrypto;
    if (!privateKey || privateKey.error) return callback(errors.BAD_CREDENTIALS);
    keystoreCrypto = keystore.crypto || keystore.Crypto;
    keythereum.deriveKey(password, keystoreCrypto.kdfparams.salt, { kdf: KDF }, function (derivedKey) {
      if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);
      callback({
        privateKey: privateKey,
        address: abi.format_address(keystore.address),
        keystore: keystore,
        derivedKey: derivedKey
      });
    });
  });
}

module.exports = importAccount;
