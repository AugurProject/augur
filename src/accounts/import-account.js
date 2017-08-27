"use strict";

var abi = require("augur-abi");
var keythereum = require("keythereum");
var errors = require("../rpc-interface").errors;

/**
 * @param {Object} p Parameters object.
 * @param {string} p.password Password for the account being imported.
 * @param {require("./login").Keystore} p.keystore Keystore object containing this account's encryption parameters.
 * @param {function} callback Called after the account's private key has been successfully decrypted.
 * @return {require("./register").Account} Logged-in account object.
 */
function importAccount(p, callback) {
  if (!p.password || p.password === "") return callback(errors.BAD_CREDENTIALS);
  keythereum.recover(p.password, p.keystore, function (privateKey) {
    if (!privateKey || privateKey.error) return callback(errors.BAD_CREDENTIALS);
    var keystoreCrypto = p.keystore.crypto || p.keystore.Crypto;
    keythereum.deriveKey(p.password, keystoreCrypto.kdfparams.salt, { kdf: keystoreCrypto.kdf }, function (derivedKey) {
      if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);
      callback({
        privateKey: privateKey,
        address: abi.format_address(p.keystore.address),
        keystore: p.keystore,
        derivedKey: derivedKey
      });
    });
  });
}

module.exports = importAccount;
