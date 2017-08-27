"use strict";

/** Type definition for CipherParams.
 * @typedef {Object} CipherParams
 * @property {string} iv Initialization vector used for this account, as a hexadecimal string.
 */

/** Type definition for Pbkdf2Params.
 * @typedef {Object} Pbkdf2Params
 * @property {number} dklen Key length in bytes (usually 32).
 * @property {number} c Number of PBKDF2 iterations used to derive the secret key.
 * @property {string} prf Pseudorandom function used with PBKDF2 (usually hmac-sha256).
 * @property {string} salt The dklen-byte salt used for this account, as a hexadecimal string.
 */

/** Type definition for ScryptParams.
 * @typedef {Object} ScryptParams
 * @property {number} dklen Key length in bytes (usually 32).
 * @property {number} n Number of scrypt iterations used to derive the secret key (usually 262144).
 * @property {number} p Parallelization factor, determines relative CPU cost (usually 1).
 * @property {number} r Block size factor used for scrypt's hash, determines relative memory cost (usually 8).
 * @property {string} salt The dklen-byte salt used for this account, as a hexadecimal string.
 */

/** Type definition for KeystoreCrypto.
 * @typedef {Object} KeystoreCrypto
 * @property {string} cipher
 * @property {string} ciphertext
 * @property {CipherParams} cipherparams
 * @property {string} kdf
 * @property {ScryptParams|Pbkdf2Params} kdfparams
 * @property {string} mac
 */

/** Type definition for Keystore.
 * @typedef {Object} Keystore
 * @property {string} address This account's Ethereum address, as a hexadecimal string.
 * @property {KeystoreCrypto} crypto Encryption parameters for this account's private key.
 * @property {string} id This account's UUID.
 * @property {number} version Keystore version number (usually 3).
 */

var abi = require("augur-abi");
var keythereum = require("keythereum");
var errors = require("../rpc-interface").errors;

/**
 * @param {Object} p Parameters object.
 * @param {string} p.password Password for the account being imported.
 * @param {Keystore} p.keystore Keystore object containing this account's encryption parameters.
 * @param {function} callback Called after the account has been successfully generated.
 * @return {require("./register").Account} Logged-in account object.
 */
function login(p, callback) {
  var password = p.password;
  var keystore = p.keystore;
  if (!keystore || password == null || password === "") return callback(errors.BAD_CREDENTIALS);
  var keystoreCrypto = keystore.crypto || keystore.Crypto;

  // derive secret key from password
  keythereum.deriveKey(password, keystoreCrypto.kdfparams.salt, {
    kdf: keystoreCrypto.kdf,
    kdfparams: keystoreCrypto.kdfparams,
    cipher: keystoreCrypto.kdf
  }, function (derivedKey) {
    if (!derivedKey || derivedKey.error) return callback(errors.BAD_CREDENTIALS);

    // verify that message authentication codes match
    var storedKey = keystoreCrypto.ciphertext;
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
}

module.exports = login;
