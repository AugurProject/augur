"use strict";

var keys = require("keythereum");
var clone = require("clone");
var abi = require("augur-abi");
var errors = require("ethrpc").errors;
var pass = require("./utils/pass");
var isFunction = require("./utils/is-function");

var login = function (keystore, password, cb) {
  var keystoreCrypto, callback, self = this;
  callback = (isFunction(cb)) ? cb : pass;
  if (!keystore || !password || password === "") return callback(errors.BAD_CREDENTIALS);
  keystoreCrypto = keystore.crypto || keystore.Crypto;

  // derive secret key from password
  keys.deriveKey(password, keystoreCrypto.kdfparams.salt, {
    kdf: keystoreCrypto.kdf,
    kdfparams: keystoreCrypto.kdfparams,
    cipher: keystoreCrypto.kdf
  }, function (derivedKey) {
    var storedKey, privateKey, e;
    if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);

    // verify that message authentication codes match
    storedKey = keystoreCrypto.ciphertext;
    if (keys.getMAC(derivedKey, storedKey) !== keystoreCrypto.mac.toString("hex")) {
      return callback(errors.BAD_CREDENTIALS);
    }

    // decrypt stored private key using secret key
    try {
      privateKey = keys.decrypt(storedKey, derivedKey.slice(0, 16), keystoreCrypto.cipherparams.iv);

      // while logged in, account object is set
      self.account = {
        privateKey: privateKey,
        address: abi.format_address(keystore.address),
        keystore: keystore,
        derivedKey: derivedKey
      };
      return callback(clone(self.account));

      // decryption failure: bad password
    } catch (exc) {
      e = clone(errors.BAD_CREDENTIALS);
      e.bubble = exc;
      return callback(e);
    }
  }); // deriveKey
};

module.exports = login;
