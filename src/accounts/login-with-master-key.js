/**
 * User-supplied plaintext private key.
 */

"use strict";

var abi = require("augur-abi");
var keythereum = require("keythereum");
var isFunction = require("../utils/is-function");
var sha256 = require("../utils/sha256");

var loginWithMasterKey = function (privateKey, callback) {
  var privateKeyBuf = (Buffer.isBuffer(privateKey)) ? privateKey : Buffer.from(privateKey, "hex");
  var account = {
    address: abi.format_address(keythereum.privateKeyToAddress(privateKeyBuf)),
    privateKey: privateKeyBuf,
    derivedKey: Buffer.from(abi.unfork(sha256(privateKeyBuf)), "hex")
  };
  if (!isFunction(callback)) return account;
  callback(account);
};

module.exports = loginWithMasterKey;
