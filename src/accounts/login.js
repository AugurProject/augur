"use strict";

var keythereum = require("keythereum");
var abi = require("augur-abi");
var pass = require("../utils/pass");
var isFunction = require("../utils/is-function");
var errors = require("../rpc-interface").errors;

var login = function (keystore, password, cb) {
  var keystoreCrypto, callback;
  callback = (isFunction(cb)) ? cb : pass;
  if (!keystore || password == null || password === "") return callback(errors.BAD_CREDENTIALS);
  keystoreCrypto = keystore.crypto || keystore.Crypto;

  // derive secret key from password
  keythereum.deriveKey(password, keystoreCrypto.kdfparams.salt, {
    kdf: keystoreCrypto.kdf,
    kdfparams: keystoreCrypto.kdfparams,
    cipher: keystoreCrypto.kdf
  }, function (derivedKey) {
    var storedKey;
    if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);

    // verify that message authentication codes match
    storedKey = keystoreCrypto.ciphertext;
    if (keythereum.getMAC(derivedKey, storedKey) !== keystoreCrypto.mac.toString("hex")) {
      return callback(errors.BAD_CREDENTIALS);
    }

    // decrypt stored private key using secret key
    try {
      callback({
        privateKey: keythereum.decrypt(storedKey, derivedKey.slice(0, 16), keystoreCrypto.cipherparams.iv),
        address: abi.format_address(keystore.address),
        keystore: keystore,
        derivedKey: derivedKey
      });

    // decryption failure: bad password
    } catch (exc) {
      console.error(exc);
      callback(errors.BAD_CREDENTIALS);
    }
  }); // deriveKey
};

module.exports = login;
