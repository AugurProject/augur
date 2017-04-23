"use strict";

var abi = require("augur-abi");
var keythereum = require("keythereum");
var uuid = require("uuid");
var errors = require("../rpc-interface").errors;
var pass = require("../utils/pass");
var isFunction = require("../utils/is-function");
var KDF = require("../constants").KDF;

var register = function (password, cb) {
  var callback = (isFunction(cb)) ? cb : pass;
  if (!password || password.length < 6) return cb(errors.PASSWORD_TOO_SHORT);

  // generate ECDSA private key and initialization vector
  keythereum.create(null, function (plain) {
    if (plain.error) return callback(plain);

    // derive secret key from password
    keythereum.deriveKey(password, plain.salt, { kdf: KDF }, function (derivedKey) {
      var encryptedPrivateKey, address, kdfparams, keystore, account;
      if (derivedKey.error) return callback(derivedKey);
      encryptedPrivateKey = keythereum.encrypt(plain.privateKey, derivedKey.slice(0, 16), plain.iv).toString("hex");

      // encrypt private key using derived key and IV, then
      // store encrypted key & IV, indexed by handle
      address = abi.format_address(keythereum.privateKeyToAddress(plain.privateKey));
      kdfparams = {
        dklen: keythereum.constants[KDF].dklen,
        salt: plain.salt.toString("hex")
      };
      if (KDF === "scrypt") {
        kdfparams.n = keythereum.constants.scrypt.n;
        kdfparams.r = keythereum.constants.scrypt.r;
        kdfparams.p = keythereum.constants.scrypt.p;
      } else {
        kdfparams.c = keythereum.constants.pbkdf2.c;
        kdfparams.prf = keythereum.constants.pbkdf2.prf;
      }
      keystore = {
        address: address,
        crypto: {
          cipher: keythereum.constants.cipher,
          ciphertext: encryptedPrivateKey,
          cipherparams: {iv: plain.iv.toString("hex")},
          kdf: KDF,
          kdfparams: kdfparams,
          mac: keythereum.getMAC(derivedKey, encryptedPrivateKey)
        },
        version: 3,
        id: uuid.v4()
      };

      // while logged in, account object is set
      callback({
        privateKey: plain.privateKey,
        address: address,
        keystore: keystore,
        derivedKey: derivedKey
      });
    }); // deriveKey
  }); // create
};

module.exports = register;
