"use strict";

/** Type definition for Account.
 * @typedef {Object} Account
 * @property {string} address This account's Ethereum address, as a hexadecimal string.
 * @property {require("./login").Keystore} keystore Keystore object containing this account's encryption parameters.
 * @property {buffer} privateKey The private key for this account.
 * @property {buffer} derivedKey The secret key (derived from the password) used to encrypt this account's private key.
 */

var speedomatic = require("speedomatic");
var keythereum = require("keythereum");
var uuid = require("uuid");
var errors = require("../rpc-interface").errors;
var KDF = require("../constants").KDF;

/**
 * @param {Object} p Parameters object.
 * @param {string} p.password Password for the account being imported.
 * @param {function} callback Called after the account has been successfully generated.
 * @return {Account} Logged-in account object.
 */
function register(p, callback) {
  var password = p.password;
  if (!password || password.length < 6) return callback(errors.PASSWORD_TOO_SHORT);

  // generate ECDSA private key and initialization vector
  keythereum.create(null, function (plain) {
    if (plain.error) return callback(plain);

    // derive secret key from password
    keythereum.deriveKey(password, plain.salt, { kdf: KDF }, function (derivedKey) {
      if (derivedKey.error) return callback(derivedKey);
      var encryptedPrivateKey = keythereum.encrypt(plain.privateKey, derivedKey.slice(0, 16), plain.iv).toString("hex");

      // encrypt private key using derived key and IV, then
      // store encrypted key & IV, indexed by handle
      var address = speedomatic.formatEthereumAddress(keythereum.privateKeyToAddress(plain.privateKey));
      var kdfparams = {
        dklen: keythereum.constants[KDF].dklen,
        salt: plain.salt.toString("hex"),
      };
      if (KDF === "scrypt") {
        kdfparams.n = keythereum.constants.scrypt.n;
        kdfparams.r = keythereum.constants.scrypt.r;
        kdfparams.p = keythereum.constants.scrypt.p;
      } else {
        kdfparams.c = keythereum.constants.pbkdf2.c;
        kdfparams.prf = keythereum.constants.pbkdf2.prf;
      }
      var keystore = {
        address: address,
        crypto: {
          cipher: keythereum.constants.cipher,
          ciphertext: encryptedPrivateKey,
          cipherparams: { iv: plain.iv.toString("hex") },
          kdf: KDF,
          kdfparams: kdfparams,
          mac: keythereum.getMAC(derivedKey, encryptedPrivateKey),
        },
        version: 3,
        id: uuid.v4(),
      };

      // while logged in, account object is set
      callback(null, {
        privateKey: plain.privateKey,
        address: address,
        keystore: keystore,
        derivedKey: derivedKey,
      });
    }); // deriveKey
  }); // create
}

module.exports = register;
