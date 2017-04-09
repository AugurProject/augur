"use strict";

var keys = require("keythereum");
var uuid = require("uuid");
var clone = require("clone");
var abi = require("augur-abi");
var errors = require("ethrpc").errors;
var constants = require("../constants");
var pass = require("../utils/pass");
var isFunction = require("../utils/is-function");

var register = function (password, cb) {
  var callback, self = this;
  callback = (isFunction(cb)) ? cb : pass;
  if (!password || password.length < 6) return cb(errors.PASSWORD_TOO_SHORT);

  // generate ECDSA private key and initialization vector
  keys.create(null, function (plain) {
    if (plain.error) return callback(plain);

    // derive secret key from password
    keys.deriveKey(password, plain.salt, {kdf: constants.KDF}, function (derivedKey) {
      var encryptedPrivateKey, address, kdfparams, keystore;
      if (derivedKey.error) return callback(derivedKey);
      encryptedPrivateKey = keys.encrypt(plain.privateKey, derivedKey.slice(0, 16), plain.iv).toString("hex");

      // encrypt private key using derived key and IV, then
      // store encrypted key & IV, indexed by handle
      address = abi.format_address(keys.privateKeyToAddress(plain.privateKey));
      kdfparams = {
        dklen: keys.constants[constants.KDF].dklen,
        salt: plain.salt.toString("hex")
      };
      if (constants.KDF === "scrypt") {
        kdfparams.n = keys.constants.scrypt.n;
        kdfparams.r = keys.constants.scrypt.r;
        kdfparams.p = keys.constants.scrypt.p;
      } else {
        kdfparams.c = keys.constants.pbkdf2.c;
        kdfparams.prf = keys.constants.pbkdf2.prf;
      }
      keystore = {
        address: address,
        crypto: {
          cipher: keys.constants.cipher,
          ciphertext: encryptedPrivateKey,
          cipherparams: {iv: plain.iv.toString("hex")},
          kdf: constants.KDF,
          kdfparams: kdfparams,
          mac: keys.getMAC(derivedKey, encryptedPrivateKey)
        },
        version: 3,
        id: uuid.v4()
      };

      // while logged in, account object is set
      self.account = {
        privateKey: plain.privateKey,
        address: address,
        keystore: keystore,
        derivedKey: derivedKey
      };

      return callback(clone(self.account));
    }); // deriveKey
  }); // create
};

module.exports = register;
