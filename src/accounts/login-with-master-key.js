/**
 * User-supplied plaintext private key.
 */

"use strict";

var abi = require("augur-abi");
var clone = require("clone");
var keys = require("keythereum");
var isFunction = require("../utils/is-function");
var pass = require("../utils/pass");
var sha256 = require("../utils/sha256");
var accountState = require("./state");

var loginWithMasterKey = function (privateKey, cb) {
  var callback = (isFunction(cb)) ? cb : pass;
  var privateKeyBuf = (Buffer.isBuffer(privateKey)) ? privateKey : Buffer.from(privateKey, "hex");
  accountState = {
    address: abi.format_address(keys.privateKeyToAddress(privateKeyBuf)),
    privateKey: privateKeyBuf,
    derivedKey: Buffer.from(abi.unfork(sha256(privateKeyBuf)), "hex")
  };
  return callback(clone(accountState));
};

module.exports = loginWithMasterKey;
