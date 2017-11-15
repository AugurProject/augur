"use strict";

/** Type definition for NoKeystoreAccount.
 * @typedef {Object} NoKeystoreAccount
 * @property {string} address This account's Ethereum address, as a hexadecimal string.
 * @property {buffer} privateKey The private key for this account.
 * @property {buffer} derivedKey The secret key (derived from the password) used to encrypt this account's private key.
 */

var speedomatic = require("speedomatic");
var keythereum = require("keythereum");
var sha256 = require("../utils/sha256");

/**
 * Login with a user-supplied plaintext private key.
 * @param {Object} p Parameters object.
 * @param {buffer|string} privateKey The private key for this account, as a Buffer or a hexadecimal string.
 * @return {NoKeystoreAccount} Logged-in account object (note: does not have a keystore property).
 */
function loginWithMasterKey(p) {
  if (!p.privateKey) throw new Error("Private key is required");
  var privateKeyBuf = (Buffer.isBuffer(p.privateKey)) ? p.privateKey : Buffer.from(p.privateKey, "hex");
  return {
    address: speedomatic.formatEthereumAddress(keythereum.privateKeyToAddress(privateKeyBuf)),
    privateKey: privateKeyBuf,
    derivedKey: Buffer.from(speedomatic.unfork(sha256(privateKeyBuf)), "hex"),
  };
}

module.exports = loginWithMasterKey;
