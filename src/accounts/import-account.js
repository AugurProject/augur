"use strict";

var speedomatic = require("speedomatic");
var keythereum = require("keythereum");
var errors = require("../rpc-interface").errors;

/**
 * @param {Object} p Parameters object.
 * @param {string} p.password Password for the account being imported.
 * @param {string} p.address Ethereum address of the account being imported.
 * @param {require("./login").Keystore} p.keystore Keystore object containing this account's encryption parameters.
 * @param {function} callback Called after the account's private key has been successfully decrypted.
 * @return {require("./register").Account} Logged-in account object.
 */
function importAccount(p, callback) {
  if (!p.password || p.password === "") return callback(errors.BAD_CREDENTIALS);
  keythereum.recover(p.password, p.keystore, function (privateKey) {
    if (!privateKey || privateKey.error) return callback(errors.BAD_CREDENTIALS);
    var keystoreCrypto = p.keystore.crypto || p.keystore.Crypto;
    keythereum.deriveKey(p.password, keystoreCrypto.kdfparams.salt, {
      kdf: keystoreCrypto.kdf,
      kdfparams: keystoreCrypto.kdfparams,
      cipher: keystoreCrypto.cipher,
    }, function (derivedKey) {
      if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);
      // verify that message authentication codes match
      var storedKey = keystoreCrypto.ciphertext;
      if (keythereum.getMAC(derivedKey, storedKey) !== keystoreCrypto.mac.toString("hex")) {
        return callback(errors.BAD_CREDENTIALS);
      }
      callback(null, {
        privateKey: privateKey,
        address: speedomatic.formatEthereumAddress(p.address),
        keystore: p.keystore,
        derivedKey: derivedKey,
      });
    });
  });
}

module.exports = importAccount;
